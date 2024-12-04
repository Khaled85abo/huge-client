export // Helper function to convert bytes to megabytes
    const bytesToMB = (bytes: number): string => {
        const mb = bytes / (1024 * 1024);
        return mb.toFixed(2);
    };