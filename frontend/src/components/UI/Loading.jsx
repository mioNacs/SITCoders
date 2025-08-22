import React from 'react'

function Loading() {
  const [dot, setDot] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDot((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-orange-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-l-4 border-orange-400 mb-4"></div>
        <div className="text-2xl font-semibold text-orange-400 flex items-end">
          Loading
          <span className="flex-mb-1">
            {[0,1,2].map((i) => (
              <span
                key={i}
                className={`inline-block w-1 h-1 mx-0.5 rounded-full bg-orange-400 ${dot > i ? 'opacity-100' : 'opacity-20'} transition-all duration-200 animate-blink`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </span>
        </div>
        <div className="text-sm text-gray-500 mt-2">Please wait while we fetch your data.</div>
      </div>
    </div>
  );
}

export default Loading
