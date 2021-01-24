export const cartReducer = (cart = 0, action) => {
    switch (action.type) {
        case 'CART':
            return action.payload
        default:
            return cart
    }
}

export const shiftClosingReducer = (sc = false, action) => {
    switch (action.type) {
        case 'ShiftClosing':
            return action.payload
        default:
            return sc
    }
}

export const dayEndClosingReducer = (de = false, action) => {
    switch (action.type) {
        case 'DayEndClosing':
            return action.payload
        default:
            return de
    }
}