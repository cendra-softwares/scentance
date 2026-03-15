---
source: Context7 API / Next.js Docs
library: Next.js
package: nextjs
topic: cart-state-server-actions
fetched: 2026-03-14T10:00:00Z
official_docs: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
---

# Managing Shopping Cart State with Server Actions

Next.js 15 leverages React 19's `useActionState` and Server Actions for robust state management.

## Recommended Pattern
1. **Server Actions** for mutations (Add to Cart, Update Quantity, Remove).
2. **Client Components** for the UI, using `useActionState` to handle loading states and server feedback.
3. **Cookies or Database** for persistent cart state.

### Server Action Example (`actions.ts`)
```typescript
'use server'

import { cookies } from 'next/headers';

export async function addToCart(prevState: any, formData: FormData) {
  const productId = formData.get('productId');
  const cartId = (await cookies()).get('cartId')?.value;
  
  try {
    // Logic to add item to database/cart
    await addItemToCart(cartId, productId);
    return { message: 'Success', success: true };
  } catch (e) {
    return { message: 'Failed to add to cart', success: false };
  }
}
```

### Client Component Example (`AddToCart.tsx`)
```tsx
'use client'

import { useActionState } from 'react';
import { addToCart } from '@/app/actions';

export function AddToCart({ productId }: { productId: string }) {
  const [state, formAction, isPending] = useActionState(addToCart, { message: '', success: false });

  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      <button disabled={isPending}>
        {isPending ? 'Adding...' : 'Add to Cart'}
      </button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

## Key Benefits in Next.js 15
- **Progressive Enhancement**: Forms work even if JavaScript hasn't loaded.
- **Simplified State**: `useActionState` manages the lifecycle of the server request automatically.
- **Type Safety**: Full end-to-end type safety between the form and the server action.
