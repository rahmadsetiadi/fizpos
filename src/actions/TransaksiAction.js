export const cartAction = (cart) => ({
    type: 'CART',
    payload: cart
})

export const shiftClosingAction = (sc) => ({
    type: 'ShiftClosing',
    payload: sc
})

export const dayEndClosingAction = (de) => ({
    type: 'DayEndClosing',
    payload: de
})