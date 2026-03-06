// 鐧诲綍椤甸潰JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const appPath = window.AppPath;
    // 鑾峰彇DOM鍏冪礌
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const forgotBox = document.getElementById('forgotBox');
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotForm = document.getElementById('forgotForm');
    
    // 鍒囨崲鎸夐挳
    const showRegisterBtn = document.getElementById('showRegister');
    const showForgotBtn = document.getElementById('showForgot');
    const backToLoginBtn = document.getElementById('backToLogin');
    const backToLoginFromForgotBtn = document.getElementById('backToLoginFromForgot');
    
    // 杈撳叆妗嗗姩鐢绘晥鏋?
    const inputs = document.querySelectorAll('.input-wrapper input');
    inputs.forEach(input => {
        // 娣诲姞鐒︾偣鍔ㄧ敾
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // 杈撳叆鏃堕殣钘忛敊璇秷鎭?
        input.addEventListener('input', function() {
            hideAllErrors();
        });
    });
    
    // 鍒囨崲琛ㄥ崟妗?
    function switchForm(fromBox, toBox) {
        fromBox.classList.remove('active');
        setTimeout(() => {
            toBox.classList.add('active');
        }, 250);
    }
    
    // 鏄剧ず娉ㄥ唽妗?
    showRegisterBtn.addEventListener('click', function() {
        switchForm(loginBox, registerBox);
    });
    
    // 鏄剧ず蹇樿瀵嗙爜妗?
    showForgotBtn.addEventListener('click', function() {
        switchForm(loginBox, forgotBox);
    });
    
    // 杩斿洖鐧诲綍妗?
    backToLoginBtn.addEventListener('click', function() {
        switchForm(registerBox, loginBox);
    });
    
    backToLoginFromForgotBtn.addEventListener('click', function() {
        switchForm(forgotBox, loginBox);
    });
    
    // 鐧诲綍琛ㄥ崟鎻愪氦
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        
        // 楠岃瘉杈撳叆
        if (!username || !password) {
            showError('loginErrorMsg', '璇疯緭鍏ョ敤鎴峰悕鍜屽瘑鐮?);
            return;
        }
        
        // 鏄剧ず鍔犺浇鐘舵€?
        const loginBtn = loginForm.querySelector('.submit-btn');
        loginBtn.classList.add('loading');
        
        // 鍙戦€佺櫥褰曡姹?
        fetch(appPath.api('/login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('鐧诲綍鎴愬姛锛屾鍦ㄨ烦杞?..');
                setTimeout(() => {
                    window.location.href = appPath.page('main.html');
                }, 1500);
            } else {
                showError('loginErrorMsg', data.msg || '鐢ㄦ埛鍚嶆垨瀵嗙爜閿欒');
                loginBtn.classList.remove('loading');
            }
        })
        .catch(error => {
            console.error('鐧诲綍閿欒:', error);
            showError('loginErrorMsg', '鏈嶅姟鍣ㄥ紓甯革紝璇风◢鍚庡啀璇?);
            loginBtn.classList.remove('loading');
        });
    });
    
    // 娉ㄥ唽琛ㄥ崟鎻愪氦
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        const confirmPassword = document.getElementById('regConfirmPassword').value.trim();
        
        // 楠岃瘉杈撳叆
        if (!username || !password || !confirmPassword) {
            showError('registerErrorMsg', '璇峰～鍐欐墍鏈夊瓧娈?);
            return;
        }
        
        if (password !== confirmPassword) {
            showError('registerErrorMsg', '涓ゆ杈撳叆鐨勫瘑鐮佷笉涓€鑷?);
            return;
        }
        
        if (password.length < 6) {
            showError('registerErrorMsg', '瀵嗙爜闀垮害鑷冲皯6浣?);
            return;
        }
        
        // 鏄剧ず鍔犺浇鐘舵€?
        const registerBtn = registerForm.querySelector('.submit-btn');
        registerBtn.classList.add('loading');
        
        // 鍙戦€佹敞鍐岃姹?
        fetch(appPath.api('/register'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('娉ㄥ唽鎴愬姛锛?);
                setTimeout(() => {
                    // 娓呯┖琛ㄥ崟
                    registerForm.reset();
                    // 鍒囨崲鍥炵櫥褰曟
                    switchForm(registerBox, loginBox);
                    // 鑷姩濉厖鐧诲綍琛ㄥ崟
                    document.getElementById('loginUsername').value = username;
                    document.getElementById('loginPassword').value = password;
                }, 1500);
            } else {
                showError('registerErrorMsg', data.msg || '娉ㄥ唽澶辫触锛岀敤鎴峰悕鍙兘宸插瓨鍦?);
            }
            registerBtn.classList.remove('loading');
        })
        .catch(error => {
            console.error('娉ㄥ唽閿欒:', error);
            showError('registerErrorMsg', '鏈嶅姟鍣ㄥ紓甯革紝璇风◢鍚庡啀璇?);
            registerBtn.classList.remove('loading');
        });
    });
    
    // 蹇樿瀵嗙爜琛ㄥ崟鎻愪氦
    forgotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('forgotUsername').value.trim();
        const newPassword = document.getElementById('forgotNewPassword').value.trim();
        const confirmPassword = document.getElementById('forgotConfirmPassword').value.trim();
        
        // 楠岃瘉杈撳叆
        if (!username || !newPassword || !confirmPassword) {
            showError('forgotErrorMsg', '璇峰～鍐欐墍鏈夊瓧娈?);
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showError('forgotErrorMsg', '涓ゆ杈撳叆鐨勫瘑鐮佷笉涓€鑷?);
            return;
        }
        
        if (newPassword.length < 6) {
            showError('forgotErrorMsg', '瀵嗙爜闀垮害鑷冲皯6浣?);
            return;
        }
        
        // 鏄剧ず鍔犺浇鐘舵€?
        const forgotBtn = forgotForm.querySelector('.submit-btn');
        forgotBtn.classList.add('loading');
        
        // 鍙戦€侀噸缃瘑鐮佽姹?
        fetch(appPath.api('/resetPassword'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `username=${encodeURIComponent(username)}&newPassword=${encodeURIComponent(newPassword)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccess('瀵嗙爜閲嶇疆鎴愬姛锛?);
                setTimeout(() => {
                    // 娓呯┖琛ㄥ崟
                    forgotForm.reset();
                    // 鍒囨崲鍥炵櫥褰曟
                    switchForm(forgotBox, loginBox);
                    // 鑷姩濉厖鐢ㄦ埛鍚?
                    document.getElementById('loginUsername').value = username;
                }, 1500);
            } else {
                showError('forgotErrorMsg', data.msg || '瀵嗙爜閲嶇疆澶辫触锛岀敤鎴峰悕鍙兘涓嶅瓨鍦?);
            }
            forgotBtn.classList.remove('loading');
        })
        .catch(error => {
            console.error('閲嶇疆瀵嗙爜閿欒:', error);
            showError('forgotErrorMsg', '鏈嶅姟鍣ㄥ紓甯革紝璇风◢鍚庡啀璇?);
            forgotBtn.classList.remove('loading');
        });
    });
    
    // 娣诲姞閿洏浜嬩欢
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // 濡傛灉褰撳墠鍦ㄦ敞鍐屾垨蹇樿瀵嗙爜椤甸潰锛岃繑鍥炵櫥褰曢〉闈?
            if (registerBox.classList.contains('active')) {
                switchForm(registerBox, loginBox);
            } else if (forgotBox.classList.contains('active')) {
                switchForm(forgotBox, loginBox);
            }
        }
    });
    
    // 娣诲姞椤甸潰鍔犺浇鍔ㄧ敾
    addPageLoadAnimation();
});

// 闅愯棌鎵€鏈夐敊璇秷鎭?
function hideAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.remove('show');
    });
}

// 鏄剧ず閿欒娑堟伅
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // 娣诲姞鎶栧姩鍔ㄧ敾
    errorElement.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        errorElement.style.animation = '';
    }, 500);
}

// 鏄剧ず鎴愬姛娑堟伅
function showSuccess(message) {
    showNotification(message, 'success');
}

// 鏄剧ず閿欒閫氱煡
function showErrorNotification(message) {
    showNotification(message, 'error');
}

// 鏄剧ず閫氱煡
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 娣诲姞杩涘叆鍔ㄧ敾
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // 鑷姩绉婚櫎
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 娣诲姞椤甸潰鍔犺浇鍔ㄧ敾
function addPageLoadAnimation() {
    const loginBox = document.getElementById('loginBox');
    
    // 鐧诲綍妗嗗姩鐢?
    loginBox.style.opacity = '0';
    loginBox.style.transform = 'translateX(-50px)';
    
    setTimeout(() => {
        loginBox.style.transition = 'all 0.8s ease-out';
        loginBox.style.opacity = '1';
        loginBox.style.transform = 'translateX(0)';
    }, 100);
}

// 娣诲姞CSS鍔ㄧ敾
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .input-wrapper.focused label {
        top: -5px;
        font-size: 0.85rem;
        color: #667eea;
    }
    
    .input-wrapper.focused .input-line {
        background: linear-gradient(135deg, #667eea, #764ba2);
        box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    }
`;
document.head.appendChild(style); 
