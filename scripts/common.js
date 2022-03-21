/**
 * @return {string} The reCAPTCHA rendering mode from the configuration.
 */
 function getRecaptchaMode() {
    var config = parseQueryString(location.hash);
    return config['recaptcha'] === 'invisible' ?
        'invisible' : 'normal';
  }
  
  /**
   * @return {string} The email signInMethod from the configuration.
   */
  function getEmailSignInMethod() {
    var config = parseQueryString(location.hash);
    return config['emailSignInMethod'] === 'password' ?
        'password' : 'emailLink';
  }
  
  /**
   * @return {boolean} The disable sign up status from the configuration.
   */
  function getDisableSignUpStatus() {
    var config = parseQueryString(location.hash);
    return config['disableEmailSignUpStatus'] === 'true';
  }
  
  /**
   * @return {boolean} The admin restricted operation status from the configuration.
   */
  function getAdminRestrictedOperationStatus() {
    var config = parseQueryString(location.hash);
    return config['adminRestrictedOperationStatus'] === 'true';
  }
  
  
  /**
   * @param {string} queryString The full query string.
   * @return {!Object<string, string>} The parsed query parameters.
   */
  function parseQueryString(queryString) {
    // Remove first character if it is ? or #.
    if (queryString.length &&
        (queryString.charAt(0) == '#' || queryString.charAt(0) == '?')) {
      queryString = queryString.substring(1);
    }
    var config = {};
    var pairs = queryString.split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      if (pair.length == 2) {
        config[pair[0]] = pair[1];
      }
    }
    return config;
  }
