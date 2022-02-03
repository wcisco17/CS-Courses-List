function addToCart(id) {
    const { lessons, cart } = this;

    const lesson = lessons.find((lesson) => lesson.id == id)

    if (lesson.availibility > 0)
        lesson.availibility--;
    if (lesson.availibility == 0)
        lesson.isSoldOut = true

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == lesson.id) {
            return
        }
    }

    return cart.push(lesson)
}

function removeFromCart(lessonIdx) {
    const { cart } = this;

    if (lessonIdx != null && cart.length > 0) {
        const deletCartItem = cart.find((cartItem, i) => {
            if (cartItem?.id == lessonIdx) {
                cartItem.availibility = 5
                cartItem.isSoldOut = false
                cart.splice(i, 1)
            }
        })
        return deletCartItem
    }
}

function submitForm(e) {
    e.preventDefault()
    let result = null
    const name = this.formState.nameItem;
    const phone = Number(this.formState?.phoneItem);

    const isTextValue = /^[a-zA-Z]+$/.test(name);
    const isNumberValue = /^[1-9]+$/.test(phone);

    if (!isNumberValue || !isTextValue) {
        this.formState.valid = true
        result = null;
    }
    else
        result = { name, phone }

    if (result != null) {
        // simulate the notification and return to the original state
        setTimeout(() => {
            this.isSuccessOrder = false
            window.location.reload()
        }, 3000)

        this.isSuccessOrder = true

        return result;
    }
}

function reload() {
    return window.location.reload()
}

function navigateToCart() {
    const { isCartOpen } = this;
    if (!isCartOpen)
        this.isCartOpen = true
    else
        this.isCartOpen = false
}

const methods = {
    addToCart,
    removeFromCart,
    navigateToCart,
    submitForm,
    reload
}

export { methods }
