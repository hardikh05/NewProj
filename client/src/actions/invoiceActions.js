import * as api from '../api/index'

import { ADD_NEW, UPDATE, DELETE, GET_INVOICE, FETCH_INVOICE_BY_USER, START_LOADING, END_LOADING, FETCH_ALL } from './constants'

export const getInvoices = () => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchInvoices();
        dispatch({ type: FETCH_ALL, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.error('Error fetching invoices:', error.response?.data?.message || error.message);
        dispatch({ type: END_LOADING });
    }
}

export const getInvoicesByUser = (searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data: { data } } = await api.fetchInvoicesByUser(searchQuery);
        dispatch({ type: FETCH_INVOICE_BY_USER, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.error('Error fetching user invoices:', error.response?.data?.message || error.message);
        dispatch({ type: END_LOADING });
    }
}

export const getInvoice = (id) => async (dispatch) => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const userId = user?.result?.sub || user?.result?._id || user?.result?.googleId;

    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchInvoice(id);
        
        if (!userId) {
            console.error('No user ID found');
            dispatch({ type: GET_INVOICE, payload: data });
            return;
        }

        try {
            const { data: profileData } = await api.fetchProfilesByUser(userId);
            const invoiceData = { ...data, businessDetails: profileData };
            dispatch({ type: GET_INVOICE, payload: invoiceData });
        } catch (profileError) {
            console.error('Error fetching user profile:', profileError.response?.data?.message || profileError.message);
            // Still dispatch the invoice data even if profile fetch fails
            dispatch({ type: GET_INVOICE, payload: data });
        }
        
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.error('Error fetching invoice:', error.response?.data?.message || error.message);
        dispatch({ type: END_LOADING });
    }
}

export const createInvoice =(invoice, history) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const { data } = await api.addInvoice(invoice)
        dispatch({ type: ADD_NEW, payload: data })
        history.push(`/invoice/${data._id}`)
        dispatch({ type: END_LOADING })
    } catch (error) {
        console.log(error)
    }
}

export const updateInvoice =(id, invoice) => async (dispatch) => {

    try {
        const { data } = await api.updateInvoice(id, invoice)
        dispatch({ type: UPDATE, payload: data })
        
    } catch (error) {
        console.log(error)
    }
}

export const deleteInvoice =(id, openSnackbar) => async (dispatch) => {
    try {
        await api.deleteInvoice(id)

        dispatch({type: DELETE, payload: id})
        openSnackbar("Invoice deleted successfully")
    } catch (error) {
        console.log(error.response)
    }
}