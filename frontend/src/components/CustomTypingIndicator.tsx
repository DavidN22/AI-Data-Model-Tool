const TypingIndicator = () => {
    return (
        <div className="flex space-x-1 items-center" style={{ marginTop: '-5px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className="w-1 h-5 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-full animate-wave"
                    style={{ animationDelay: `${i * 0.15}s` }}
                ></span>
            ))}
        </div>
    );
};

export default TypingIndicator;
