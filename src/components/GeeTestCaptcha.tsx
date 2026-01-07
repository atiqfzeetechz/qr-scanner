import { useEffect, useRef, useState } from 'react';
import { useAxios } from '../hooks/useAxios';

export default function GeetestPuzzleCaptcha({ onSuccess, onError }) {
  const { get } = useAxios();
  const captchaInstance = useRef(null);
  const [status, setStatus] = useState('Loading captcha...');

  // Load Geetest script
  const loadGeetestScript = () => {
    return new Promise((resolve, reject) => {
      if (window.initGeetest) {
        console.log('✅ Geetest script already loaded');
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://static.geetest.com/static/tools/gt.js';
      script.async = true;
      script.id = 'geetest-script';

      script.onload = () => {
        console.log('✅ Geetest script loaded successfully');
        resolve(true);
      };

      script.onerror = (err) => {
        console.error('❌ Failed to load Geetest script:', err);
        reject(err);
      };

      document.head.appendChild(script);
    });
  };

  // Initialize puzzle captcha
  const initializePuzzleCaptcha = async (config) => {
    try {
      console.log('🔄 Initializing Geetest with config:', config);

      // Wait for script to load
      await loadGeetestScript();

      // Check if initGeetest exists
      if (typeof window.initGeetest !== 'function') {
        throw new Error('Geetest initialization function not found');
      }

      window.initGeetest(
        {
          // Basic config
          gt: config.gt,
          challenge: config.challenge,
          offline: config.offline,
          new_captcha: config.new_captcha,
          
          // ✅ PUZZLE MODE CONFIGURATION
          product: 'float', // 'float' shows puzzle, 'bind' is embedded
          
          // Slide/Puzzle specific settings
          width: '100%',
          lang: 'en',
          https: true,
          
          // Optional: Specify captcha type
          // 'slide' for sliding puzzle, 'icon' for icon selection
          type: 'slide', // or 'icon' for icon selection mode
          
          // UI Customization for puzzle
          slideStyle: {
            float: 'left',
            marginTop: '20px'
          },
          
          // Advanced options
          apiServers: ['api.geetest.com'],
          timeout: 30000,
          hideBar: ['close'],
          hideSuccess: false,
          userInfo: '',
          rem: false,
          
          // For mobile responsiveness
          nextWidth: '100%',
          
          // For slide puzzle difficulty
          riskType: 'slide'
        },
        (captchaObj) => {
          console.log('✅ Geetest captcha object created');
          captchaInstance.current = captchaObj;

          // Append to container
          captchaObj.appendTo('#geetest-puzzle-container');

          // Event Listeners
          captchaObj.onReady(() => {
            console.log('✅ Geetest puzzle captcha is ready');
            setStatus('Slide the puzzle to verify');
            
            // Show the container
            const container = document.getElementById('geetest-puzzle-container');
            if (container) {
              container.style.minHeight = '250px'; // Puzzle needs more space
              container.style.padding = '10px';
              container.style.border = '1px solid #e0e0e0';
              container.style.borderRadius = '8px';
              container.style.backgroundColor = '#f9f9f9';
            }
          });

          captchaObj.onSuccess(() => {
            console.log('🎉 Puzzle completed successfully!');
            setStatus('Verified successfully!');
            
            const result = captchaObj.getValidate();
            console.log('Validation result:', result);
            
            // Prepare data for backend
            const captchaData = {
              geetest_challenge: result.geetest_challenge,
              geetest_validate: result.geetest_validate,
              geetest_seccode: result.geetest_seccode,
              captcha_type: 'puzzle'
            };
            
            onSuccess?.(captchaData);
          });

          captchaObj.onError((error) => {
            console.error('❌ Captcha error:', error);
            setStatus('Captcha error. Please refresh.');
            onError?.('Captcha verification failed');
          });

          captchaObj.onClose(() => {
            console.log('Captcha closed');
            setStatus('Captcha closed. Please refresh.');
          });

          captchaObj.onFail(() => {
            console.log('Captcha failed');
            setStatus('Verification failed. Try again.');
          });
        }
      );
    } catch (error) {
      console.error('❌ Failed to initialize Geetest:', error);
      setStatus('Failed to load captcha. Please refresh page.');
      onError?.(error.message);
    }
  };

  // Fetch config and initialize
  useEffect(() => {
    const init = async () => {
      try {
        setStatus('Loading configuration...');
        const config = await get('/geetest/register');
        console.log('Received config:', config);
        
        // Check if offline mode (no puzzle)
        if (config.offline) {
          console.warn('⚠️ Offline mode - puzzle will not work');
          setStatus('Captcha in offline mode. Refresh page.');
        }
        
        await initializePuzzleCaptcha(config);
      } catch (error) {
        console.error('❌ Failed to fetch config:', error);
        setStatus('Failed to load. Please refresh page.');
      }
    };

    init();

    // Cleanup
    return () => {
      if (captchaInstance.current) {
        try {
          captchaInstance.current.destroy();
        } catch (e) {
          console.warn('Error during cleanup:', e);
        }
      }
    };
  }, []);

  // Reset captcha
  const resetCaptcha = () => {
    if (captchaInstance.current) {
      captchaInstance.current.reset();
      setStatus('Slide the puzzle to verify');
      console.log('🔄 Captcha reset');
    }
  };

  // Refresh completely
  const refreshCaptcha = () => {
    const script = document.getElementById('geetest-script');
    if (script) script.remove();
    
    if (captchaInstance.current) {
      captchaInstance.current.destroy();
    }
    
    window.initGeetest = undefined;
    captchaInstance.current = null;
    
    // Reinitialize
    setStatus('Reloading captcha...');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div style={{ width: '100%', margin: '20px 0' }}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ 
          fontWeight: 'bold', 
          marginBottom: '10px', 
          display: 'block',
          color: '#333'
        }}>
          Complete the Puzzle:
        </label>
        <div 
          id="geetest-puzzle-container"
          style={{
            minHeight: '180px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            padding: '15px',
            border: '1px solid #e0e0e0'
          }}
        >
          <div style={{ color: '#666', textAlign: 'center' }}>
            {status}
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginTop: '15px' 
      }}>
        <button
          type="button"
          onClick={resetCaptcha}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          ↻ Try Again
        </button>
        
        <button
          type="button"
          onClick={refreshCaptcha}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ↻ Refresh Captcha
        </button>
      </div>

      <div style={{ 
        marginTop: '10px', 
        fontSize: '12px', 
        color: '#666',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        borderLeft: '3px solid #4CAF50'
      }}>
        <strong>Note:</strong> Slide the puzzle piece to match the image.
      </div>
    </div>
  );
}