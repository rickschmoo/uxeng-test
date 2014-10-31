var gulp = require("gulp");
var fs = require("fs");
var bower = require("gulp-bower");
var angularTemplates = require("gulp-angular-templates");
var autoprefixer = require("gulp-autoprefixer");
var browserify = require("gulp-browserify");
var concat = require("gulp-concat");
var handlebars = require("handlebars");
var browserSync = require("browser-sync");
var del = require("del");
var sass = require("gulp-sass");
var theo = require("theo");
var minify = require("gulp-minify-css");
var util = require("./utils/Util.js");
var generateSpacing = require('./utils/spacing');
var reload = browserSync.reload;


var font = "Tondo";

var paths = {
  output: "./www",
  scripts: "./src/**/*.js",
  assets: "./assets",
  sass: "./src/scss/*.scss",
  generated: "./generated",
  bower: "./bower_components",
  npm: "./node_modules",
  s1variables: "./node_modules/s1variables/variables",
  s1assetIcons: "./node_modules/s1assets/icons",
  s1assetFonts: "./node_modules/s1assets/Fonts/" + font + "/webfonts/**",
  s1variableIcons: "./node_modules/s1variables/variables",
  iconsRelativeLocation: "../assets/icons"
};

gulp.task("init", function() {
  if (!fs.existsSync(paths.generated)) {
    fs.mkdirSync(paths.generated);
  }
  if (!fs.existsSync(paths.output)) {
    fs.mkdirSync(paths.output);
  }
  if (!fs.existsSync(paths.output + "/js")) {
    fs.mkdirSync(paths.output + "/js");
  }

  gulp.src(paths.bower + '/angular-route/angular-route.min.js.map').pipe(gulp.dest(paths.output + '/js'));
  gulp.src(paths.bower + '/jquery/dist/jquery.min.map').pipe(gulp.dest(paths.output + '/js'));
  gulp.src(paths.bower + '/angular-animate/angular-animate.min.js').pipe(gulp.dest(paths.output + '/js'));
});

handlebars.registerHelper("fileNameConvert", function(name) {
  name = name.split("_").join("-").toLowerCase();
  return name;
});

handlebars.registerHelper("customNameConvert", function(name) {
  name = name.toLowerCase();
  if (name.indexOf("action_") !== -1) {
    name = name.substring(7);
  }
  if (name.indexOf("custom") !== -1) {
    name = name.split("_").join("");
  }
  return name;
});

gulp.task("bower", function() {
  return bower().pipe(gulp.dest(paths.bower));
});

gulp.task("styles", function() {
  gulp.src([paths.npm + "/normalize.css/normalize.css"])
  return gulp.src("./src/scss/*.scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.output + "/css"))
    .pipe(reload({stream:true}));
});

gulp.task("scripts:app", function() {
  return gulp.src("src/js/main.js")
    .pipe(browserify({
      debug: true
    }))
    .pipe(gulp.dest(paths.output + "/js"))
    .pipe(reload({stream:true}));
});

gulp.task("scripts:templates", function() {
  return gulp.src("./src/html/*.html")
    .pipe(angularTemplates({
      module: "app"
    }))
    .pipe(concat("ng-templates.js"))
    .pipe(gulp.dest(paths.output + "/js"))
    .pipe(reload({stream:true}));;
});

gulp.task("scripts:vendor", function() {
  return gulp.src([
      paths.bower + "/jquery/dist/jquery.min.js",
      paths.bower + "/angular/angular.min.js",
      paths.bower + "/angular-animate/angular-animate.min.js",
      paths.bower + "/angular-touch/angular-touch.min.js",
      paths.bower + "/angular-route/angular-route.min.js"
    ])
    .pipe(concat("vendor.js"))
    .pipe(gulp.dest(paths.output + "/js"));
});

gulp.task("clean", function() {
  return del([paths.output]);
});

gulp.task("clean-all", ["clean"], function() {
  return del([paths.bower, paths.npm, paths.generated]);
});

gulp.task("clean-bower", ["clean"], function() {
  return del([paths.bower, paths.generated]);
});

gulp.task("index", function() {
  return gulp.src(['./src/*.html']).pipe(gulp.dest(paths.output));
});

gulp.task("assets:s1", function(done) {
  gulp.src(paths.s1assetIcons + "/actions/**").pipe(gulp.dest(paths.output + "/assets/icons/actions"));
  gulp.src(paths.s1assetIcons + "/custom/**").pipe(gulp.dest(paths.output + "/assets/icons/custom"));
  gulp.src(paths.s1assetIcons + "/doctype/**").pipe(gulp.dest(paths.output + "/assets/icons/doctype"));
  gulp.src(paths.s1assetIcons + "/font/s1utility/**").pipe(gulp.dest(paths.output + "/assets/icons/font/s1utility"));
  gulp.src(paths.s1assetIcons + "/standard/**").pipe(gulp.dest(paths.output + "/assets/icons/standard"));
  gulp.src(paths.s1assetIcons + "/utility/**").pipe(gulp.dest(paths.output + "/assets/icons/utility"));
  gulp.src(paths.s1assetFonts).pipe(gulp.dest(paths.output + "/assets/fonts/" + font));
  gulp.src(paths.npm + "/s1assets/Fonts/ss-pika/webfonts/*").pipe(gulp.dest(paths.output + "/assets/fonts/ss-pika"));
  gulp.src(paths.npm + "/s1assets/Fonts/ss-standard/webfonts/*").pipe(gulp.dest(paths.output + "/assets/fonts/ss-standard"));
  return done();
});

gulp.task("assets:app", function() {
  return gulp.src(paths.assets + "/**")
    .pipe(gulp.dest(paths.output + '/assets'));
});

gulp.task("variables", function(done) {
  var count, generateBackgrounds, iconFilesToGenerateCSS, results;
  if (!fs.existsSync(paths.generated)) {
    fs.mkdirSync(paths.generated);
  }


  generateSpacing(paths.s1variables + '/s1base.json', paths.output + '/css/spacings.css');
  theo.convert(paths.s1variables + '/*.json', paths.generated, {
    templates: ['scss', 'json']
  });

  iconFilesToGenerateCSS = [
    {
      path: paths.s1variableIcons + "/bgStandard.json",
      template: "./templates/backgrounds.hbs"
    }, {
      path: paths.s1variableIcons + "/bgCustom.json",
      template: "./templates/backgrounds.hbs"
    }, {
      path: paths.s1variableIcons + "/bgStandard.json",
      dir: paths.iconsRelativeLocation + "/standard/svg",
      template: "./templates/icons.hbs"
    }, {
      path: paths.s1variableIcons + "/bgCustom.json",
      dir: paths.iconsRelativeLocation + "/custom",
      template: "./templates/icons.hbs"
    }, {
      path: paths.s1variableIcons + "/bgActions.json",
      dir: paths.iconsRelativeLocation + "/actions",
      template: "./templates/icons.hbs"
    }
  ];
  count = iconFilesToGenerateCSS.length;
  results = "";
  generateBackgrounds = function(jsonFile, templatePath, location) {
    var template;
    template = handlebars.compile(fs.readFileSync(templatePath).toString());
    results += template({
      icons: util.generateIcons(jsonFile),
      iconsLocation: location
    });
    count--;
    if (count === 0) {
      fs.writeFileSync("./generated/icons.scss", results);
      return gulp.src("./generated/icons.scss").pipe(sass({
        errLogToConsole: true
      })).pipe(gulp.dest(paths.output + "/css")).on("end", done);
    }
  };
  return iconFilesToGenerateCSS.forEach(function(input) {
    return generateBackgrounds(input.path, input.template, input.dir);
  });
});

gulp.task("watch", function() {
  gulp.watch(["./src/scss/*.scss", "./src/scss/**/*.scss"], ["styles"]);
  gulp.watch("./src/index.html", ["index"]);
  gulp.watch("./src/html/*.html", ["scripts:templates"]);
  gulp.watch(["./src/js/*.js", "./src/js/**/*.js"], ["scripts:app"]);

  return gulp.watch("./assets/**", ["assets:app"]);
});

gulp.task("browser-sync", function() {
  return browserSync({
    server: {
      baseDir: paths.output
    }
  });
});

gulp.task('heroku', function(cb) {
  return require('./heroku-build').build(paths.output, cb);
});

gulp.task("dev", ["browser-sync"], function() {
  return gulp.start("watch");
});

gulp.task("default", ["clean", "bower"], function() {
  return gulp.start("init", "index", "variables", "styles", "assets:s1", "assets:app", "scripts:app", "scripts:vendor", "scripts:templates");
});
