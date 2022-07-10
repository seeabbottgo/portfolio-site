//last updated on 2/1/21
const config = [
  {
    name: "chels",
    suffix: "chels",
    watch: true,
    babel: true,
    minifyCSS: false,
    minifyJS: false,
    sassSuffix: []
  }
];

const babelIgnorePatterns = [
  "Project/Assets/**/@(*jquery*)",
  "Project/Assets/**/@(*MZ*)",
  "Project/Assets/**/@(*OS*)",
  "Project/Assets/**/@(*TweenMax*)",
  "Project/Assets/**/@(*moment*)",
  "Project/Assets/**/@(*easel*)",
  "Project/Assets/**/@(*Tween.js*)",
  "Project/Assets/**/js/vendor/**"
];

// **********DO NOT EDIT BELOW HERE***********
import { src, dest, watch, series, parallel } from "gulp";
import source from "vinyl-source-stream";
import fileExists from "file-exists";
import download from "gulp-download2";
import sass from "gulp-sass";
import autoprefixer from "autoprefixer";
import concat from "gulp-concat";
import postcss from "gulp-postcss";
import cssnano from "cssnano";
import postcssPresetEnv from "postcss-preset-env";
import sourcemaps from "gulp-sourcemaps";
import flatten from "gulp-flatten";
import browserSync from "browser-sync";
import replace from "gulp-replace";
import babel from "gulp-babel";
import gulpif from "gulp-if";
import terser from "gulp-terser";
import glob from "glob";
import filter from "gulp-filter";

let babelIgnore = [];
for (const pattern of babelIgnorePatterns) {
  glob(pattern, function(er, files) {
    for (const file of files) {
      babelIgnore.push(file);
    }
  });
}

const paths = {
  topLevel: [
    {
      root: "Project/Assets/Global",
      subDir: [
        "sass",
        "js",
        "js/vendor",
        "js/mz",
        "js/scripts",
        "img",
        "fonts",
        "survey",
        "misc",
        "email",
        "overlays"
      ]
    },
    {
      root: "Project/Creative",
      subDir: ["Mocks", "Source Files"]
    }
  ],
  programLevel: [
    {
      root: "Project/Assets",
      subDir: [
        "build",
        "css",
        "sass",
        "js",
        "js/vendor",
        "js/mz",
        "js/scripts",
        "img",
        "fonts",
        "survey",
        "misc",
        "email",
        "overlays"
      ]
    }
  ]
};

//from cdn
const downloadFiles = [
  {
    url: "https://assets.smartactivator.com/js/mz/MZ.2.2.0.4.js",
    subDir: "js/mz",
    globalFile: true
  },
  {
    url: "https://assets.smartactivator.com/js/mz/OS.1.0.4.0.js",
    subDir: "js/mz",
    globalFile: true
  },
  {
    url:
      "https://assets.smartactivator.com/js/gen/jquery/3.2.0/jquery-3.2.0.min.js",
    subDir: "js/vendor",
    globalFile: true
  }
];

const files = [
  { prefix: "app", ext: "js", subDir: "js", content: "/* Do Epic Code! */" },
  { prefix: "app", ext: "css", subDir: "css", content: "/* Do Epic Code! */" },
  {
    prefix: "app",
    ext: "scss",
    subDir: "sass",
    content: "/* Do Epic Code! */"
  },
  {
    prefix: "main",
    ext: "js",
    subDir: "js/scripts",
    content: "/* Do Epic Code! */"
  }
];

//create css and js files and place them in a folder
const createFile = (fileName, content, folder) => {
  var stream = source(fileName);
  stream.end(content);
  stream.pipe(dest(folder));
};

const readMe = () => {
  //check to see if readme.md exists
  fileExists("readMe.md", function(err, exists) {
    if (!exists) {
      // console.log("new file created");
      createFile(
        "readme.md",
        `# Write something useful about this project.`,
        "."
      );
    }
  });
};

const createDir = (dir, name) => {
  let p = src([".gitkeep"]);

  for (let i = 0; i < paths[dir].length; i++) {
    let path = paths[dir][i];
    p = p.pipe(dest(`${path.root}/${name}`));

    for (let j = 0; j < path.subDir.length; j++) {
      p = p.pipe(dest(`${path.root}/${name}/${path.subDir[j]}`));
    }
  }

  return p;
};

const addFiles = (dir, suffix, sassSuffix) => {
  for (const file of files) {
    let prefix = file.prefix;
    let subDir = file.subDir;
    let ext = file.ext;
    let newFilePath = `${paths.programLevel[0].root}/${dir}/${subDir}/`;
    let newFileName = `${prefix}-${suffix}.${ext}`;

    console.log("file=", file);
    //check to see if directory exists by checking for a .gitkeep file
    fileExists(newFilePath + newFileName, function(err, exists) {
      if (!exists) {
        // console.log("new file created");
        createFile(newFileName, file.content, newFilePath);
      }
    });
  }
};

const addDownloadFiles = dir => {
  for (const file of downloadFiles) {
    let url = file.url,
      subDir = file.subDir,
      filePath;

    if (file.globalFile) {
      filePath = `${paths.topLevel[0].root}/${subDir}/${url.substring(
        url.lastIndexOf("/") + 1
      )}`;
    } else {
      filePath = `${
        paths.programLevel[0].root
      }/${dir}/${subDir}/${url.substring(url.lastIndexOf("/") + 1)}`;
    }

    fileExists(filePath, function(err, exists) {
      let path = file.globalFile
        ? `${paths.topLevel[0].root}/${subDir}`
        : `${paths.programLevel[0].root}/${dir}/${subDir}`;

      if (!exists) {
        console.log("new file downloaded");
        download(url).pipe(dest(path));
      }
    });
  }
};

const stylesheets = (program, suffix, done) => {
  console.log("sass changed in " + program.name);

  const plugins = [autoprefixer, postcssPresetEnv];

  return src(
    `${paths.programLevel[0].root}/${program.name}/sass/app-${suffix}.scss`,
    { allowEmpty: true }
  )
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(concat(`app-${suffix}.css`))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write("."))
    .pipe(dest(`${paths.programLevel[0].root}/${program.name}/css`))
    .on("end", () => {
      build(program, done);
    })
    .pipe(browserSync.stream());
};

const scripts = (program, done) => {
  console.log("js changed in " + program.name, `app-${program.suffix}.js`);

  return src(`${paths.programLevel[0].root}/${program.name}/js/scripts/*.js`)
    .pipe(sourcemaps.init())
    .pipe(concat(`app-${program.suffix}.js`))
    .pipe(sourcemaps.write("."))
    .pipe(dest(`${paths.programLevel[0].root}/${program.name}/js`))
    .on("end", () => {
      build(program, done);
    })
    .pipe(browserSync.stream());
};

const globalScripts = (program, done) => {
  return src(`${paths.topLevel[0].root}/js/scripts/*.js`)
    .pipe(sourcemaps.init())
    .pipe(concat(`app-global.js`))
    .pipe(sourcemaps.write("."))
    .pipe(dest(`${paths.topLevel[0].root}/js`))
    .on("end", () => {
      build(program, done);
    })
    .pipe(browserSync.stream());
};

const htmlFiles = (program, done) => {
  browserSync.reload();
  build(program, done);
  return;
};

// Watch files
function watchFiles(done) {
  //watch program directories
  for (const program of config) {
    if (program.watch) {
      watch(
        [
          `${paths.programLevel[0].root}/${program.name}/**/*.html`,
          `!${paths.programLevel[0].root}/${program.name}/build/**`,
          `${paths.topLevel[0].root}/**/*.html`
        ],
        function(done) {
          htmlFiles(program, done);
          done();
        }
      );

      watch(
        `${paths.programLevel[0].root}/${program.name}/sass/**/*.scss`,
        function(done) {
          for (const suffix of program.sassSuffix) {
            stylesheets(program, suffix, done);
          }

          stylesheets(program, program.suffix, done);
          done();
        }
      );
      watch(
        [
          `${paths.programLevel[0].root}/${program.name}/js/scripts/**/*.js`,
          `${paths.programLevel[0].root}/${program.name}/js/mz/**/*.js`,
          `${paths.programLevel[0].root}/${program.name}/js/vendor/**/*.js`
        ],
        function(done) {
          scripts(program, done);
          done();
        }
      );
    }
  }

  // watch global directories
  watch(`${paths.topLevel[0].root}/sass/**/*.scss`, function(done) {
    for (const program of config) {
      stylesheets(program, program.suffix, done);
    }
    done();
  });
  watch(
    [
      `${paths.topLevel[0].root}/js/scripts/*.js`,
      `${paths.topLevel[0].root}/js/mz/*.js`
    ],
    function(done) {
      for (const program of config) {
        globalScripts(program, done);
      }
      done();
    }
  );
}

const startBrowserSync = done => {
  browserSync.create();
  browserSync.init({
    server: "Project/Assets"
  });

  done();
};

const build = (program, done) => {
  console.log(
    "build that shit!",
    `${paths.programLevel[0].root}/${program.name}/build`
  );

  const buildDir = `${paths.programLevel[0].root}/${program.name}/build`;

  //images && video
  src([
    `${paths.programLevel[0].root}/${program.name}/img/**/*.{jpg,gif,png,svg,mp4,webm,mov,avi,mkv,flv}`
  ])
    .pipe(flatten())
    .pipe(dest(buildDir));

  //css
  src(`${paths.programLevel[0].root}/${program.name}/css/**/*.css`)
    .pipe(
      replace(
        /(url\(["'])([^\)]+?\.[woff|eot|woff2|ttf|svg|png|jpg]*)(["']\))/g,
        function(match) {
          if (match.includes("http")) {
            return match;
          } else {
            let str = match;
            //run regex a second time on the string to separate into groups
            let regex = /(url\(["'])([^\)]+?\.[woff|eot|woff2|ttf|svg|png|jpg]*)(["']\))/;
            // console.log("replace path for", regex.exec(str)[0]);
            //get each group in matched string
            let group1 = regex.exec(str)[1];
            let group2 = regex.exec(str)[2].replace(/^.*[\\/]/, "");
            let group3 = regex.exec(str)[3];
            return group1 + group2 + group3;
          }
        }
      )
    )
    .pipe(gulpif(program.minifyCSS, postcss([cssnano])))
    .pipe(dest(buildDir));

  //js
  const f = filter(["**", "!Project/Assets/**/js/vendor/**"], {
    restore: true
  });
  src([
    `${paths.programLevel[0].root}/${program.name}/js/**/*.js`,
    `${paths.topLevel[0].root}/js/**/*.js`,
    //don't move js from any of the "script" folders
    `!${paths.programLevel[0].root}/${program.name}/js/scripts/**`,
    `!${paths.topLevel[0].root}/js/scripts/**`
  ])
    .pipe(f)
    .pipe(
      replace(/(["'])([^\s)]*\.png|[^\s)]*\.jpg|[^\s)]*\.svg)(["'])/g, function(
        match
      ) {
        if (match.includes("http")) {
          //is absolute path then return
          return match;
        } else {
          // console.log(match);
          let str = match;
          //run regex a second time on the string to separate into groups
          let regex = /(["'])([^\s)]*\.png|[^\s)]*\.jpg|[^\s)]*\.svg)(["'])/;
          // console.log("replace path for", regex.exec(str)[0]);
          //get each group in matched string
          let group1 = regex.exec(str)[1];
          let group2 = regex.exec(str)[2].replace(/^.*[\\/]/, "");
          let group3 = regex.exec(str)[3];
          return group1 + group2 + group3;
        }
      })
    )
    .pipe(f.restore)
    .pipe(
      gulpif(
        program.babel,
        babel({
          presets: ["@babel/preset-env"],
          ignore: babelIgnore
        }).on("error", console.error.bind(console))
      )
    )
    .pipe(gulpif(program.minifyJS, terser()))
    .pipe(flatten())
    .pipe(dest(buildDir));

  //map files
  src([`${paths.programLevel[0].root}/${program.name}/**/*.map`])
    .pipe(flatten())
    .pipe(dest(buildDir));

  //fonts
  src([
    `${paths.programLevel[0].root}/${program.name}/fonts/**`,
    `${paths.topLevel[0].root}/fonts/**`
  ])
    .pipe(flatten())
    .pipe(dest(buildDir));

  //overlays
  src([
    `${paths.programLevel[0].root}/${program.name}/overlays/**`,
    `${paths.topLevel[0].root}/overlays/**`
  ])
    .pipe(flatten())
    .pipe(dest(buildDir));

  //html
  src([
    `${paths.programLevel[0].root}/${program.name}/*.html`,
    `${paths.topLevel[0].root}/*.html`
  ])
    .pipe(
      //remove file paths for all elements that support the src attribute
      //find src="" instances
      replace(/src=['"](.*?)['"]/g, function(match) {
        // console.log("replace path for", match);

        if (match.includes("http") || (match === `src=""`) || (match === `src=''`)) {
          //is absolute path then return
          return match;
        } else {
          //remove and path and add back src attribute
          return "src=" + '"' + match.replace(/^.*[\\/]/, "");
        }
        
      })
  )
  .pipe(
    //remove file paths for all elements that support the src attribute
    //find poster="" instances
    replace(/poster=['"](.*?)['"]/g, function(match) {
      // console.log("replace path for", match);
      if (match.includes("http") || (match === `poster=""`) || (match === `poster=''`)) {
        //is absolute path then return
        return match;
      } else {
        //remove and path and add back src attribute
        return "poster=" + '"' + match.replace(/^.*[\\/]/, "");
      }
    })
  )    
  .pipe(
      //remove paths from link href
      replace(/(<link\s+(?:[^>]*?\s+)?href=["'])(.*?)(["'].*)/g, function(
        match
      ) {
        let str = match;

        // if absolute SA path don't strip the path
        if (str.includes("smartactivator.blob.core.windows.net")) {
          return str;
        }

        //run regex a second time on the string to separate into groups
        let regex = /(<link\s+(?:[^>]*?\s+)?href=["'])(.*?)(["'].*)/;
        // console.log("replace path for", regex.exec(str)[0]);
        //get each group in matched string
        let group1 = regex.exec(str)[1];
        let group2 = regex.exec(str)[2].replace(/^.*[\\/]/, "");
        let group3 = regex.exec(str)[3];
        return group1 + group2 + group3;
      })
    )
    .pipe(flatten())
    .pipe(dest(buildDir));

  done();
};

function handleError() {
  console.log("babel error");
}

const gitKeep = () => {
  //For some reason gulp 4 will not create .gitkeep file for each directory if one does not exist in the directory first. .gitKeep is needed to create directories with no files. This is required for both Gulp and so empty directories can be pushed to Bitbucket.
  var gk = source(".gitkeep");
  gk.end("");
  gk.pipe(dest("./"));
  return gk;
};

let start = series(
  done => {
    gitKeep();
    setTimeout(done, 100);
  },
  // create top level directories
  done => {
    createDir("topLevel", "");
    done();
  },
  //create program directories
  done => {
    for (const program of config) {
      createDir("programLevel", program.name);
    }
    done();
  },
  //add files and templates
  done => {
    for (const program of config) {
      addFiles(program.name, program.suffix, program.sassSuffix);
      addDownloadFiles(program.name);
    }

    //add additional sass files
    for (const program of config) {
      for (const suffix of program.sassSuffix) {
        let newFilePath = `${paths.programLevel[0].root}/${program.name}/sass/`;
        let sassFileName = `app-${suffix}.scss`;
        //check to see if directory exists by checking for a .gitkeep file
        fileExists(newFilePath + sassFileName, function(err, exists) {
          if (!exists) {
            // console.log("new file created");
            createFile(sassFileName, "//Do Epic Code", newFilePath);
          }
        });
      }
    }
    // add readme
    readMe();
    done();
  },
  // automatically refresh the browser when you save
  done => {
    let timer = setTimeout(function() {
      clearTimeout(timer);
      startBrowserSync(done);
    }, 1000);
    done();
  },
  // run tasks when changes are made and saved
  done => {
    let timer = setTimeout(function() {
      clearTimeout(timer);
      watchFiles(done);
    }, 2000);
    done();
  }
);

let buildAll = done => {
  console.log("build all!");
  for (const program of config) {
    build(program, done);
  }
  done();
};

export { start, buildAll };


