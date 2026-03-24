import * as React from 'react';

interface EmailOrderItem {
  name: string;
  quantity: number;
  price: string;
  volume?: string | null;
}

interface OrderReceivedEmailProps {
  customerName: string;
  orderId: string;
  items: EmailOrderItem[];
  totalAmount: number;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export const OrderReceivedEmail: React.FC<Readonly<OrderReceivedEmailProps>> = ({
  customerName,
  orderId,
  items,
  totalAmount,
  shippingAddress,
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
      <p style={{ color: '#a1a1aa', fontSize: '14px', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
        Order Received
      </p>
    </div>

    <div style={{ marginBottom: '30px' }}>
      <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
        Dear {customerName},
      </p>
      <p style={{ color: '#d4d4d8', lineHeight: '1.6' }}>
        Thank you for your order. We are delighted to prepare your chosen fragrances. Your order has been received and is currently being processed.
      </p>
      <p style={{ color: '#d4d4d8', lineHeight: '1.6', marginTop: '10px' }}>
        <strong>Please note:</strong> You will receive a formal confirmation email within a week once our team reviews and validates your order.
      </p>
      <p style={{ color: '#d4d4d8', lineHeight: '1.6', marginTop: '10px' }}>
        If you do not receive it or have any questions, please contact us at <strong>+91 9188645067</strong>.
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
        Order Summary
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
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total</span>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{totalAmount.toLocaleString()}</span>
      </div>
    </div>

    <div style={{ marginBottom: '30px' }}>
      <h2 style={{ 
        fontSize: '14px', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em', 
        color: '#71717a',
        marginBottom: '15px'
      }}>
        Shipping Details
      </h2>
      <p style={{ color: '#d4d4d8', margin: '0', lineHeight: '1.6' }}>
        {shippingAddress.address}<br />
        {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
      </p>
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
      <p>© 2024 Scentence. All rights reserved.</p>
      <p>If you have any questions, please contact us at Scentence.in@gmail.com</p>
    </div>
  </div>
);
