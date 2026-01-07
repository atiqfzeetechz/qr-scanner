import { useEffect, useRef, useState } from 'react';
import { useAxios } from '../hooks/useAxios';

// Extend Window interface for Geetest
declare global {
  interface Window {
    initGeetest?: (config: any, callback: (captchaObj: any) => void) => void;
  }
}

interface CaptchaProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export default function GeetestPuzzleCaptcha({ onSuccess, onError }: CaptchaProps) {
  const { get } = useAxios();
  const captchaInstance = useRef<any>(null);
  const [status, setStatus] = useState('Loading captcha...');
  console.log(status)

  // Load Geetest script
  const loadGeetestScript = () => {
    return new Promise((resolve, reject) => {
      if (window?.initGeetest) {
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
  const initializePuzzleCaptcha = async (config: any) => {
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

          // ✅ PUZZLE MODE - Show puzzle with track
          product: 'bind', // 'bind' shows puzzle immediately in container

          // Puzzle specific settings
          width: '100%',
          lang: 'en',
          https: true,

          // Puzzle type configuration
          type: 'slide', // slide puzzle type

          // Advanced puzzle options
          apiServers: ['api.geetest.com'],
          timeout: 30000,

          // Show necessary UI elements
          hideBar: ['close'], // Only hide close button
          hideSuccess: false, // Show success animation

          // Puzzle interaction modes
          userInfo: '',
          rem: false,

          // Mobile responsiveness
          nextWidth: '100%',

          // Puzzle difficulty
          riskType: 'slide',

          // Auto show puzzle on load
          autoShow: true,

          // Puzzle piece animation from top-right
          slideStyle: {
            position: 'absolute',
            top: '10px',
            right: '10px'
          }
        },
        (captchaObj: any) => {
          console.log('✅ Geetest captcha object created');
          captchaInstance.current = captchaObj;

          // Append to container
          captchaObj.appendTo('#geetest-puzzle-container');

          // Event Listeners
          captchaObj.onReady(() => {
            console.log('✅ Geetest puzzle captcha is ready');
            setStatus('Drag the puzzle piece to complete the image');

            // Show the container with puzzle-specific styling
            const container = document.getElementById('geetest-puzzle-container');
            if (container) {
              container.style.minHeight = '320px';
              container.style.padding = '15px';
              container.style.border = 'none';
              container.style.borderRadius = '12px';
              container.style.backgroundColor = '#ffffff';
              container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              
              // Responsive sizing for desktop
              if (window.innerWidth > 768) {
                container.style.maxWidth = '400px';
                container.style.margin = '0 auto';
              }
            }

            // Add CSS for puzzle piece animation from top-right
            const style = document.createElement('style');
            style.textContent = `
              .gt_cut_bg {
                animation: slideFromTopRight 0.5s ease-out;
              }
              @keyframes slideFromTopRight {
                0% {
                  transform: translate(100px, -50px);
                  opacity: 0;
                }
                100% {
                  transform: translate(0, 0);
                  opacity: 1;
                }
              }
              .gt_box {
                border-radius: 8px;
                overflow: visible;
                max-width: 350px;
                margin: 0 auto;
              }
              .gt_slider {
                margin-top: 15px !important;
              }
              @media (max-width: 768px) {
                .gt_box {
                  max-width: 100%;
                }
                .gt_slider {
                  margin-top: 10px !important;
                }
              }
            `;
            document.head.appendChild(style);

            // Force show puzzle immediately
            setTimeout(() => {
              const puzzleImg = container?.querySelector('.gt_cut_fullbg') as HTMLElement;
              if (puzzleImg) {
                puzzleImg.style.visibility = 'visible';
                puzzleImg.style.opacity = '1';
              }
            }, 100);
          });

          captchaObj.onSuccess(() => {
            console.log('🎉 Puzzle completed successfully!');
            setStatus('✅ Puzzle solved! Verification complete.');

            const result = captchaObj.getValidate();
            console.log('Validation result:', result);

            // Add success styling
            const container = document.getElementById('geetest-puzzle-container');
            if (container) {
              container.style.border = 'none';
              container.style.backgroundColor = '#f8fff8';
            }

            // Prepare data for backend
            const captchaData = {
              geetest_challenge: result.geetest_challenge,
              geetest_validate: result.geetest_validate,
              geetest_seccode: result.geetest_seccode,
              captcha_type: 'puzzle'
            };

            onSuccess?.(captchaData);
          });

          captchaObj.onError((error: any) => {
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
    } catch (error: any) {
      console.error('❌ Failed to initialize Geetest:', error);
      setStatus('Failed to load captcha. Please refresh page.');
      onError?.(error?.message || 'Unknown error');
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
      setStatus('Drag the puzzle piece to complete the image');
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

    if (window.initGeetest) {
      delete window.initGeetest;
    }
    captchaInstance.current = null;

    // Reinitialize
    setStatus('Reloading captcha...');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div style={{ width: '100%', margin: '20px 0', maxWidth: window.innerWidth > 768 ? '500px' : '100%', marginLeft: 'auto', marginRight: 'auto' }}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{
          fontWeight: 'bold',
          marginBottom: '10px',
          display: 'block',
          color: '#333'
        }}>
          🧩 Complete the Puzzle:
        </label>
        <p style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '15px',
          lineHeight: '1.4'
        }}>
          Drag the slider or puzzle piece to complete the verification.
        </p>
        <div
          id="geetest-puzzle-container"
          style={{
            minHeight: '250px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '15px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {/* <div style={{ color: '#666', textAlign: 'center' }}>
            {status}
          </div> */}
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '15px',
        marginLeft:"10px"
      }}>
        <button
          type="button"
          onClick={resetCaptcha}
          style={{
            padding: '8px 10px',
            background: 'linear-gradient(135deg, #1F7A3D 0%, #F2C94C 50%, #1C2A5A 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(31, 122, 61, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(31, 122, 61, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(31, 122, 61, 0.3)';
          }}
        >
          ↻ Try Again
        </button>

        <button
          type="button"
          onClick={refreshCaptcha}
          style={{
            padding: '8px 10px',
            background: 'linear-gradient(135deg, #1F7A3D 0%, #F2C94C 50%, #1C2A5A 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(31, 122, 61, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(28, 42, 90, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(28, 42, 90, 0.3)';
          }}
        >
          ↻ Refresh Captcha
        </button>
      </div>

      <div style={{
        marginTop: '10px',
        fontSize: '12px',
        color: '#666',
        padding: '12px',
        backgroundColor: '#f0f8ff',
        borderRadius: '8px',
        borderLeft: '4px solid #4CAF50'
      }}>
        <strong>🎯 Instructions:</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
          <li>Drag the slider to move the puzzle piece</li>
          <li>Position it to complete the missing part</li>
          <li>The verification will complete automatically</li>
        </ul>
      </div>
    </div>
  );
}