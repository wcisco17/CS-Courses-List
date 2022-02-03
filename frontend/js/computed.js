function sortLessons() {
    const value = (this.selected)
    const search = this.search.split('')
    let searchHash = new Map()
    let sortedlessons = new Array()

    for (let s = 0; s < search.length; s++) {
        if (search.length > 0) searchHash.set(s, search[s].toLowerCase())
    }

    for (let i = 0; i < this.lessons.length; i++) {
        const location = this.lessons[i].location.toLowerCase()
        const subject = this.lessons[i].subject.toLowerCase()
        let next = 0
        // searching for subject
        searchFunc(searchHash, subject, next, sortedlessons, i, this.lessons)

        // searching for location
        searchFunc(searchHash, location, next, sortedlessons, i, this.lessons)
    }

    if (sortedlessons.length <= 0)
        return sortLesson(this.lessons, value, this.order)
    else
        return sortLesson(sortedlessons, value, this.order)
}

function searchFunc(searchHash, searchValue, next, sortedlessons, i, lessons) {
    // loop over every value in our hashtable
    for (let [key, value] of searchHash.entries()) {
        // only run this if the first value that we've searched is the same as our (subject or location)
        if ((value === searchValue[next] && key === next)) {
            // we only want the first value
            if (key === 0 && searchHash.size <= 1) sortedlessons.push(lessons[i])

            // move on to the next
            next = 1
            for (let j = next; j < searchHash.size; j++) {
                // assign the next value
                next = j

                // start at the next value and so on...
                if (searchHash.get(j) !== undefined && searchHash.size > j) {
                    // find the next value coresponding to the first
                    if ((searchHash.get(j) === searchValue[j] && key === j)) sortedlessons.push(lessons[i])
                }
            }
        }
    }

    return sortedlessons
}

function sortLesson(lessons, value, order) {
    const asc = 'Ascending'
    const desc = 'Descending'

    return lessons.sort((firstVal, secondVal) => {
        if (firstVal[value] < secondVal[value] && order === asc) return -1
        if (secondVal[value] < firstVal[value] && order === desc) return -1
        return 0
    })
}

const computed = { sortLessons }

export default computed