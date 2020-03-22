module.exports = function override(config) {
  /*
    Fix for webpack throwing the following error: 
    " 
      ./node_modules/pdfjs-dist/build/pdf.js
      Critical dependency: require function is used in a way in
      which dependencies cannot be statically extracted
    "

    This is chiefly an issue mozilla's pdf.js library and the fact that
    create-react-app sets the webpack parser's requireEnsure flag to false
    which restricts us from using the react-pdf lib, which doesn't have
    any viable alternatives at the moment.
    
    General solutions are:
    1. Eject and set requireEnsure to true in the webpack config
    2. Use react-app-rewired (or similar solutions) to customize the create-react-app webpack config
    3. Include react-pdf globally and so that it's not built using webpack

    I'm going with #2 here because it seems to have the least friction,
    and we should try our best to avoid globals libs, also this enables
    us to easily extend create-react-app in the future if we decide to
    use webpack or babel plugins without ejecting. 
  */
  config.module.rules[0].parser.requireEnsure = true
  return config
}
