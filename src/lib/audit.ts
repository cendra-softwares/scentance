'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/auth';

/**
 * Audit action types for tracking admin mutations
 */
export type AuditAction =
  | 'create_order'
  | 'update_order_status'
  | 'delete_order'
  | 'create_product'
  | 'update_product'
  | 'delete_product'
  | 'send_confirmation_email';

/**
 * Audit log entry interface
 */
export interface AuditLogEntry {
  id?: string;
  user_id: string;
  user_email?: string;
  action: AuditAction;
  resource_type: string;
  resource_id: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at?: string;
}

/**
 * Log an admin action to the audit_logs table
 */
export async function logAuditEvent(
  action: AuditAction,
  resourceType: string,
  resourceId: string,
  details?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const authResult = await getAuthenticatedUser();

    if (!authResult || !authResult.user) {
      console.error('Audit log failed: No authenticated user');
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase.from('audit_logs').insert({
      user_id: authResult.user.id,
      user_email: authResult.user.email,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
    });

    if (error) {
      console.error('Failed to write audit log:', error);
      return { success: false, error: 'Failed to log audit event' };
    }

    return { success: true };
  } catch (err) {
    console.error('Audit logging error:', err);
    return { success: false, error: 'Audit logging failed' };
  }
}
