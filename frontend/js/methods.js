function addToCart(id) {
    const lesson = this.lessons.data.find((lesson) => lesson._id === id)
    if (lesson)
        return fetch('/add_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id, quantity: lesson.availibility -= 1})
        }).then(res => {
            return reload()
        })
            .then(data => window.location.reload())
            .catch(err => err)
}

async function submitForm(e) {
    e.preventDefault()
    let result = null
    const name = this.formState.nameItem;
    const phone = Number(this.formState?.phoneItem);

    const isTextValue = /^[a-zA-Z]+$/.test(name);
    const isNumberValue = /^[1-9]+$/.test(phone);

    if (!isNumberValue || !isTextValue) {
        this.formState.valid = true
        result = null;
    } else
        result = {name, phone}

    if (result) {
        return fetch('/update_lessons', {
            method: 'PUT',
        }).then(res => {
            return reload()
        }).catch(err => err)
    }
}

function reload() {
    return window.location.reload()
}

function navigateToCart() {
    const {isCartOpen} = this;
    if (!isCartOpen)
        this.isCartOpen = true
    else
        this.isCartOpen = false
}

const methods = {
    addToCart,
    navigateToCart,
    submitForm,
    reload
}

export {methods}
