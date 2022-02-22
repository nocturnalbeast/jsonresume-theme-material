var fs = require("fs");
var path = require("path");
var Handlebars = require("handlebars");

function render(resume) {
    if (resume.work && resume.work.length) {
        resume.workEnabled = true;
    } else {
        resume.workEnabled = false;
    }

    if (resume.volunteer && resume.volunteer.length) {
        resume.volunteerEnabled = true;
    } else {
        resume.volunteerEnabled = false;
    }

    if (resume.projects && resume.projects.length) {
        resume.projectsEnabled = true;
    } else {
        resume.projectsEnabled = false;
    }

    if (resume.education && resume.education.length) {
        resume.educationEnabled = true;
    } else {
        resume.educationEnabled = false;
    }

    if (resume.awards && resume.awards.length) {
        resume.awardsEnabled = true;
    } else {
        resume.awardsEnabled = false;
    }

    if (resume.publications && resume.publications.length) {
        resume.publicationsEnabled = true;
    } else {
        resume.publicationsEnabled = false;
    }

    if (resume.skills && resume.skills.length) {
        resume.skillsEnabled = true;
    } else {
        resume.skillsEnabled = false;
    }

    if (resume.interests && resume.interests.length) {
        resume.interestsEnabled = true;
    } else {
        resume.interestsEnabled = false;
    }

    if (resume.languages && resume.languages.length) {
        resume.languagesEnabled = true;
    } else {
        resume.languagesEnabled = false;
    }

    if (resume.references && resume.references.length) {
        resume.referencesEnabled = true;
    } else {
        resume.referencesEnabled = false;
    }

    // use an ugly hack to inject Export to PDF option within the profiles section
    if (process.argv.slice(2)[0] != "export") {
        const exportToPDF = {
            network: "Export to PDF",
            username: "",
            url: "javascript:window.print();"
        };
        if (resume.basics.profiles && resume.basics.profiles.length) {
            resume.basics.profiles[resume.basics.profiles.length] = exportToPDF;
        } else {
            resume.basics.profiles[0] = exportToPDF;
        }
    }

    var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
    var tpl = fs.readFileSync(__dirname + "/main.hbs", "utf-8");

    var partialsDir = path.join(__dirname, 'partials');
    var filenames = fs.readdirSync(partialsDir);
    filenames.forEach(function (filename) {
        var matches = /^([^.]+).hbs$/.exec(filename);
        if (!matches) {
            return;
        }
        var name = matches[1];
        var filepath = path.join(partialsDir, filename)
        var template = fs.readFileSync(filepath, 'utf8');

        Handlebars.registerPartial(name, template);
    });

    return Handlebars.compile(tpl)({
        css: css,
        resume: resume
    });
}

module.exports = {
    render: render
};
