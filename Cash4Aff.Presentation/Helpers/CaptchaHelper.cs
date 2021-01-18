using BotDetect.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cash4Aff.Presentation.Helpers
{
    public static class CaptchaHelper
    {
        public static MvcCaptcha GetRegistrationCaptcha()
        {
            // create the control instance 
            MvcCaptcha registrationCaptcha = new MvcCaptcha("RegistrationCaptcha");

            // set up client-side processing of the Captcha code input textbox 
            registrationCaptcha.UserInputID = "CaptchaCode";

            // Captcha settings 
            registrationCaptcha.ImageSize = new System.Drawing.Size(255, 50);
            registrationCaptcha.CodeLength = 5;
            registrationCaptcha.CodeStyle = BotDetect.CodeStyle.Alphanumeric;
            registrationCaptcha.ImageStyle = BotDetect.ImageStyle.Bubbles;
            registrationCaptcha.SoundEnabled = false;
            registrationCaptcha.ReloadEnabled = true;
            registrationCaptcha.HelpLinkEnabled = false;


            return registrationCaptcha;
        }
    }
}