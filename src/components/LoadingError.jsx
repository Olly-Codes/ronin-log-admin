const LoadingError = ({ title, errorMessage, fetchData }) => {
    return (
        <section className="error-content">
            <div className="heading-wrapper">
                <h1>{title}</h1>
            </div>
            <div className="error-wrapper">
                <p>{errorMessage}</p>
                <button 
                    type="button" 
                    className="loading-error-btn"
                    onClick={fetchData}
                >
                    Try again
                </button>
            </div>
        </section>
    );
};

export default LoadingError;