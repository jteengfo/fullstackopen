const BlogForm = ({
    handleSubmit,
    handleTitleChange,
    handleAuthorChange,
    handleURLChange,
    title,
    author,
    url,
}) => {
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    Title: 
                    <input
                        type='text'
                        value={title}
                        name='Title'
                        onChange={handleTitleChange}
                    />
                </div>
                <div>
                    Author:
                    <input
                        type='text'
                        value={author}
                        name='Author'
                        onChange={handleAuthorChange}
                    />
                </div>
                <div>
                    URL:
                    <input
                        type='text'
                        value={url}
                        name='URL'
                        onChange={handleURLChange}
                    />
                </div>
                <button>Create</button>
            </form>
        </div>
    )
}

export default BlogForm