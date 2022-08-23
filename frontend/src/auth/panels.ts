import '../views/auth/auth.scss';

export const registerWindow = () => `
  <div class="auth__reg" id="reg">
    <input class="auth__input-auth" type="text" id="user-reg">
    <input class="auth__input-auth" type="text" id="password-reg">
    <button class="auth__reg-btn" type="submit" id="reg-user">Registration</button>
    <p class="auth__message" id="reg-message">already have an account?</p>
    <p class="auth__skip" id="reg-skip-1">continue without authorization</p>
  </div>
`;

export const authWindow = () => `
  <div class="auth__auth" id="auth">
    <input class="auth__input-auth" type="text" id="user-auth">
    <input class="auth__input-auth" type="text" id="password-auth">
    <button class="auth__auth-btn" type="submit" id="auth-user">LogIn</button>
    <p class="auth__skip" id="reg-skip-2">continue without authorization</p>
  </div>
`;
