//v1.0.4.0
//**********RELEASE NOTES******************
//v1.0.4.0
//05/29/2018
//ECG
//For SAW, added saveImageByFileName and redoImage (this only works with DSLR for now)
//*********************************************
//v1.0.3.1
//03/23/2017
//Eric G.
//Auto add form element to body in postResult() if it doesn't exist
//********************************************
//v1.0.3.0
//03/17/2017
//Scott S.?
//stringFromTimeInMilliseconds was added to 
//correctly format the dateCaptured time stamp
//********************************************
//v1.0.2.0
//02/08/2016
//Scott S.
//Rolled up all SMARTACTIVATORWEB submit results into postResult()
//added a time stamp to SMARTACTIVATORWEB result submission
//********************************************
//v1.0.1.3
//01/26/2016
//Eric G.
//Added _mz_saUrlPrefix to be used with SMARTACTIVATORWEB
//and adding the URL prefix to image sources set in JS files
//********************************************
//v1.0.1.1
//01/25/2016
//Eric G.
//Added Check to encodeSuffixForiOS for SMARTACTIVATORWEB
//*****************************************
//v1.0.1.0
//01/25/2016
//Eric G.
//Added double touch check for Win SA
//Added SMARTACTIVATORWEB check for Web SA
//*****************************************

var _mz_DblTouchFlag = false;
var _mz_saUrlPrefix = '';

//POSSIBLE OPTIONS:
//Win
//Windows
//Mac
//iPad
//iPhone
//MacIntosh
//X11
//Linux
//Android
//Droid
function OS(os)
{
    os = os.toLowerCase();
    switch (os)
    {
        case 'android':
            os = 'linux';
            break;
        case 'droid':
            os = 'linux';
            break;
        case 'ipad':
            os = 'mac';
            break;
        case 'iphone':
            os = 'mac';
            break;
        case 'macintosh':
            os = 'mac';
            break;
        case 'mac':
            os = 'mac';
            break;
        case 'windows':
            os = 'win';
            break;
        default:
            break;
    }
    if (os === "smartactivatorweb" && (typeof SMARTACTIVATORWEB !== "undefined" && SMARTACTIVATORWEB === true))
    {
        return true;
    } else if (navigator.appVersion.toLowerCase().indexOf(os) != -1)
        return true;
    else
        return false;
}

function SubmitResult(document, formName, suffix)
{
    var result = BuildResult(document, formName);

    if (suffix != null)
    {
        result = result + encodeSuffixForiOS(suffix);
    }

    SubmitResultString(result);
}

//MM-dd-yy HH:mm:ss
function stringFromTimeInMilliseconds(time, fullYear)
{
    function n(n)
    {
        return n > 9 ? "" + n : "0" + n;
    }
    var d = new Date(time);
    var date = n(d.getDate());
    var months = new Array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');
    var month = months[d.getMonth()];
    var year = d.getFullYear().toString();
    if (!fullYear)
        year = year.substr(year.length - 2, 2);

    var hour = n(d.getHours());
    var min = n(d.getMinutes());
    var sec = n(d.getSeconds());
    // MM-dd-yy HH:mm:ss
    return month + '-' + date + '-' + year + ' ' + hour + ':' + min + ':' + sec;
}

function postResult(result)
{
    if (typeof document.forms["mozeus"] === "undefined" || document.forms["mozeus"] == null)
    {
        var form = document.createElement('form');
        form.id = "mozeus";
        form.name = 'mozeus';
        document.body.appendChild(form);
    }
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'SmartActivatorWebResult';
    input.value = result;
    document.forms['mozeus'].appendChild(input);

    var timeInput = document.createElement('input');
    timeInput.type = 'hidden';
    timeInput.name = 'SmartActivatorWebTime';
    timeInput.value = stringFromTimeInMilliseconds(new Date().getTime());
    document.forms['mozeus'].appendChild(timeInput);

    document.forms['mozeus'].method = 'post';
    document.forms['mozeus'].action = 'submitResult';
    document.forms['mozeus'].submit();
}

function SubmitResultString(result)
{
    if (OS("SMARTACTIVATORWEB"))
    {
        postResult(result);
    } else if (OS("Android"))
    {
        Android.result(result);
        Android.exit();
    } else if (OS("Mac"))
    {
        var uri = 'sa://reportResult?' + result.replace(/;/g, "&");
        document.location.href = uri;
    } else if (typeof MzSA !== "undefined" && typeof MzSA.reportResult !== "undefined" && typeof MzSA.reportResult === "function")
    {
        if (_mz_DblTouchFlag === false)
        {
            _mz_DblTouchFlag = true;
            MzSA.reportResult(result);
            setTimeout(function ()
            {
                _mz_DblTouchFlag = false;
            }, 500);
        }
    }
    else if (window.frameElement && window.frameElement.nodeName == "IFRAME" && typeof window.parent.$SAW !== "undefined")
    {
        window.parent.$SAW.submitResultString(result);
    }
    else
    {
        alert(result);
    }
}

function BuildResult(document, formName)
{
    var result = '';
    var elem = document.getElementById(formName).elements;

    for (var i = 0; i < elem.length; i++)
    {
        if (elem[i].getAttribute('id') != 'EmailDomain' && elem[i].getAttribute('id') != 'Domain' && elem[i].getAttribute('id').substring(0, 3) != "mz_")
        {
            if (elem[i].type == "text" || elem[i].type == "textarea" || elem[i].type == "number" || elem[i].type == "tel" || elem[i].type == "email")
            {
                if (elem[i].value.trim() != '')
                    result += elem[i].getAttribute('id') + "=" + encodeForiOS(elem[i].value) + ";"
            } else if (elem[i].type == "select-one")
            {
                if (elem[i].options.length > 0 && elem[i].options[elem[i].selectedIndex].value.trim() != '')
                    result += elem[i].getAttribute('id') + "=" + encodeForiOS(elem[i].options[elem[i].selectedIndex].value) + ";"
            } else if (elem[i].type == "checkbox")
            {
                result += elem[i].getAttribute('data-id') + "=";
                if (elem[i].checked)
                {
                    result += "Yes;";
                } else
                {
                    result += "No;"
                }
            } else if (elem[i].type == "radio" && elem[i].checked)
            {
                result += elem[i].getAttribute('id') + "=";
                result += encodeForiOS(elem[i].value) + ";"
            } else if (elem[i].type == "hidden")
            {
                result += elem[i].getAttribute('id') + "=";
                result += encodeForiOS(elem[i].value) + ";"
            }
        }
    }

    return result;
}
function encodeSuffixForiOS(val)
{
    var nuVal = "";
    try
    {
        if ((OS("mac") || OS("macintosh") || OS("iphone") || OS("ipad")) && (OS("SMARTACTIVATORWEB") === false))
        {
            var s1 = val.split(';');
            for (var i = 0; i < s1.length; i++)
            {
                var s = s1[i].split('=');
                nuVal += s[0] + "=" + encodeURIComponent(s[1].replace(';', '')) + ";";
            }
        }
    } catch (e)
    {
    }
    val = nuVal === "" ? val : nuVal;
    return val;
}
function encodeForiOS(val)
{
    try
    {
        if ((OS("mac") || OS("macintosh") || OS("iphone") || OS("ipad")) && (OS("SMARTACTIVATORWEB") === false))
        {
            val = encodeURIComponent(val);
        }
    } catch (e)
    {
    }
    return val;
}
function ReportCancel()
{
    if (OS("SMARTACTIVATORWEB"))
    {
        postResult('CANCEL');
    } else if (OS("Android"))
    {
        Android.cancel();
    } else if (OS("Mac"))
    {
        document.location.href = "sa://cancel?";
    } else if (typeof MzSA !== "undefined" && typeof MzSA.cancel !== "undefined" && typeof MzSA.cancel === "function")
    {
        if (_mz_DblTouchFlag === false)
        {
            _mz_DblTouchFlag = true;
            MzSA.cancel();
            setTimeout(function ()
            {
                _mz_DblTouchFlag = false;
            }, 500);
        }
    }
    else if (window.frameElement && window.frameElement.nodeName == "IFRAME" && typeof window.parent.$SAW !== "undefined")
    {
        window.parent.$SAW.cancel();
    }
}

function Exit()
{
    if (OS("SMARTACTIVATORWEB"))
    {
        postResult('');
    } else if (OS("Android"))
    {
        Android.exit();
    } else if (OS("Mac"))
    {
        document.location.href = "sa://reportResult?";
    } else if (typeof MzSA !== "undefined" && typeof MzSA.reportResult !== "undefined" && typeof MzSA.reportResult === "function")
    {
        if (_mz_DblTouchFlag === false)
        {
            _mz_DblTouchFlag = true;
            MzSA.reportResult('');
            setTimeout(function ()
            {
                _mz_DblTouchFlag = false;
            }, 500);
        }
    }
    else if (window.frameElement && window.frameElement.nodeName == "IFRAME" && typeof window.parent.$SAW !== "undefined")
    {
        window.parent.$SAW.exit();
    }
}

function GetDelimiter()
{
    if (OS("SMARTACTIVATORWEB"))
        return ";";
    else if (OS("Mac"))
    {
        return "&";
    } else
    {
        return ";";
    }
}

function stopSubmit()
{
    return false;
}

function saveImageByFileName(fileName)
{
    if (window.frameElement && window.frameElement.nodeName == "IFRAME" && typeof window.parent.$SAW !== "undefined")
    {

        var applyOverlayPostCapture = false;
        var selOverlayID = null;
        var selOverlayUrl = null;
        if (typeof ($sa) !== "undefined" && $sa !== null && typeof ($sa.promptAttributes) !== "undefined" && $sa.promptAttributes !== null)
        {
            try
            {
                applyOverlayPostCapture = $sa.promptAttributes.applyOverlayPostCapture ? $sa.promptAttributes.applyOverlayPostCapture : false;
                selOverlayID = $sa.promptAttributes.selOverlayID ? $sa.promptAttributes.selOverlayID : null;
                selOverlayUrl = $sa.promptAttributes.selOverlayUrl ? $sa.promptAttributes.selOverlayUrl : null;
            }
            catch (e) { console.log(e.message); }

        }
        parent.window.$SAW.saveImageByFileName(fileName, applyOverlayPostCapture, selOverlayID, selOverlayUrl);//SubmitResultString("Accept1=Yes;");
    }
}
//For use by custom review page
//works for DSLR only at this time
//05/29/2018 ECG
function redoImage(isDSLR)
{
    isDSLR = true;
    if (window.frameElement && window.frameElement.nodeName == "IFRAME" && typeof window.parent.$SAW !== "undefined")
    {

        var applyOverlayPostCapture = false;
        var selOverlayID = null;
        var selOverlayUrl = null;
        if (typeof ($sa) !== "undefined" && $sa !== null && typeof ($sa.promptAttributes) !== "undefined" && $sa.promptAttributes !== null)
        {
            try
            {
                parent.window.$SAW.redoImage(isDSLR, "editor");// $sa.e.redo();// SubmitResultString("Accept1=No;");
            }
            catch (e) { console.log(e.message); }
        }
    }
}