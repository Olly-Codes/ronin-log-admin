const LoadingError = ({ title, errorMessage, fetchData }) => {
    return (
        <section className="error-content">
            <div className="heading-wrapper">
                <h1 className="text-2xl font-bold text-primary mb-6">{title}</h1>
            </div>
            <div className="error-wrapper">
                <p className="bg-surface border border-border p-8 text-muted">{errorMessage}</p>
                <button 
                    type="button" 
                    className="loading-error-btn"
                    onClick={fetchData}
                    className="bg-accent text-primary font-semibold mt-2 py-2 px-4 cursor-pointer hover:bg-accent-hover transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Try again
                </button>
            </div>
        </section>
    );
};

export default LoadingError;