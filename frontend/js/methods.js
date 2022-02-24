
async function addToCart(id) {
    const lesson = this.lessons.data.find((lesson) => lesson._id === id)

    if (lesson) {
        let updateValues = (lesson.quantity != null) ? lesson.quantity : lesson.availibility
        console.log(updateValues)
        try {
            const orders = await fetch('/add_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {id: lesson._id, quantity: (updateValues) -= 1}
                )
            })
            if (orders.status === 200) {
                return reload()
            }
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
    }
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
        try {
            const orders = await fetch('/update_lessons', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (orders.status === 200) {
                this.isSuccessOrder = true;
                return reload()
            }
        } catch (err) {
            throw new Error(`Error: ${err}`)
        }
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
    reload,
}

export {methods}
