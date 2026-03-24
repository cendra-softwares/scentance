import * as React from 'react';

interface EmailOrderItem {
  name: string;
  quantity: number;
  price: string;
  volume?: string | null;
}

interface OrderConfirmedEmailProps {
  customerName: string;
  orderId: string;
  items: EmailOrderItem[];
  totalAmount: number;
}

export const OrderConfirmedEmail: React.FC<Readonly<OrderConfirmedEmailProps>> = ({
  customerName,
  orderId,
  items,
  totalAmount,
}) => (
  <div style={{
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    fontFamily: 'serif',
    padding: '40px 20px',
    maxWidth: '600px',
    margin: '0 auto',
  }}>
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
      <h1 style={{ 
        fontSize: '32px', 
        letterSpacing: '0.1em', 
        textTransform: 'uppercase',
        margin: '0',
        fontWeight: 'normal'
      }}>
        Scentence
      </h1>
      <p style={{ color: '#22c55e', fontSize: '14px', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
        Order Confirmed
      </p>
    </div>

    <div style={{ marginBottom: '30px' }}>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
        Dear {customerName},
      </p>
      <p style={{ color: '#d4d4d8', lineHeight: '1.6' }}>
        Your order has been officially confirmed by our team. We are now preparing your selected fragrances for shipment.
      </p>
      <p style={{ color: '#d4d4d8', lineHeight: '1.6', marginTop: '10px' }}>
        You will receive another update with the tracking information as soon as your order is dispatched.
      </p>
    </div>

    <div style={{ 
      backgroundColor: '#171717', 
      padding: '25px', 
      borderRadius: '8px', 
      marginBottom: '30px',
      border: '1px solid #27272a'
    }}>
      <h2 style={{ 
        fontSize: '14px', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em', 
        color: '#71717a',
        marginBottom: '20px',
        borderBottom: '1px solid #27272a',
        paddingBottom: '10px'
      }}>
        Confirmed Details
      </h2>
      
      {items.map((item, index) => (
        <div key={index} style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '15px',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ margin: '0', fontSize: '16px' }}>{item.name}</p>
            <p style={{ margin: '0', fontSize: '12px', color: '#71717a' }}>
              Qty: {item.quantity} 
              {item.volume && ` • ${item.volume}`}
            </p>
          </div>
          <p style={{ margin: '0', fontSize: '16px' }}>{item.price}</p>
        </div>
      ))}

      <div style={{ 
        marginTop: '20px', 
        paddingTop: '15px', 
        borderTop: '1px solid #27272a',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total Paid</span>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{totalAmount.toLocaleString()}</span>
      </div>
    </div>

    <div style={{ 
      backgroundColor: '#171717', 
      padding: '20px', 
      borderRadius: '8px', 
      textAlign: 'center',
      border: '1px solid #27272a'
    }}>
      <p style={{ margin: '0', fontSize: '12px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Order ID
      </p>
      <p style={{ margin: '5px 0 0', fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', color: '#ffffff' }}>
        {orderId.slice(0, 8).toUpperCase()}
      </p>
    </div>

    <div style={{ textAlign: 'center', marginTop: '40px', color: '#71717a', fontSize: '12px' }}>
      <p>&copy; {new Date().getFullYear()} Scentence. All rights reserved.</p>
      <p>If you have any questions, please contact us at Scentence.in@gmail.com</p>
    </div>
  </div>
);
