import { useCallback } from 'react';
import { supabase } from 'src/auth/supabase';

/**
 * Hook for creating default orders in Supabase when a new user is created
 * 
 * @returns {Object} Object containing the createUserOrders function
 */
export const useCreateUserOrders = () => {
  const createUserOrders = useCallback(async (userId, orderData = {}) => {
    try {
      if (!userId) {
        throw new Error('User ID is required to create orders');
      }

      // Get the current timestamp
      const createdAt = new Date().toISOString();

      // Prepare the default order data
      const defaultOrder = {
        user_id: userId,
        status: 'pending',
        created_at: createdAt,
        ...orderData,
      };

      // Insert the order into Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert([defaultOrder])
        .select();

      if (error) {
        console.error('Error creating order:', error);
        throw new Error(`Failed to create order: ${error.message}`);
      }

      console.log('Order created successfully:', data);
      return data;
    } catch (err) {
      console.error('useCreateUserOrders error:', err);
      throw err;
    }
  }, []);

  return {
    createUserOrders,
  };
};

/**
 * Hook for creating multiple orders in Supabase when a new user is created
 * 
 * @returns {Object} Object containing the createMultipleUserOrders function
 */
export const useCreateMultipleUserOrders = () => {
  const createMultipleUserOrders = useCallback(async (userId, ordersData = []) => {
    try {
      if (!userId) {
        throw new Error('User ID is required to create orders');
      }

      if (!Array.isArray(ordersData) || ordersData.length === 0) {
        throw new Error('Orders data must be a non-empty array');
      }

      const createdAt = new Date().toISOString();

      // Prepare the orders with user_id and timestamp
      const ordersToInsert = ordersData.map((order) => ({
        user_id: userId,
        status: order.status || 'pending',
        created_at: createdAt,
        ...order,
      }));

      // Batch insert orders into Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert(ordersToInsert)
        .select();

      if (error) {
        console.error('Error creating orders:', error);
        throw new Error(`Failed to create orders: ${error.message}`);
      }

      console.log('Orders created successfully:', data);
      return data;
    } catch (err) {
      console.error('useCreateMultipleUserOrders error:', err);
      throw err;
    }
  }, []);

  return {
    createMultipleUserOrders,
  };
};
