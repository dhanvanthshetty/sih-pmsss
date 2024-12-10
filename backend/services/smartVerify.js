const verifyDocument = async (file) => {
    // Mock AI validation logic
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = Math.random() > 0.2; // 80% chance of being valid 🥺
        resolve({
          isValid,
          data: {
            type: isValid ? 'valid' : 'invalid',
            clarity: isValid ? 'clear' : 'unclear',
          },
        });
      }, 2000);
    });
  };
  
  module.exports = { verifyDocument };
  