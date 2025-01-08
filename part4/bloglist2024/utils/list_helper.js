

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}


const favoriteBlog = (blogs) => {
    const reducer = (max, blog) => {
        // compare likes of the current blog to the max
        return max.likes > blog.likes ? max : blog 
    }

    return blogs.length === 0
        ? null // means no blogs in the list
        : blogs.reduce(reducer, blogs[0]) // start with the first blog
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}