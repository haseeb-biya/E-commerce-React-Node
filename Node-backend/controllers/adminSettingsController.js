import asyncHandler from 'express-async-handler';
import Setting from '../models/settingModel.js'

const viewSettings = asyncHandler(async (req, res) => {
    const getSettings = await Setting.findOne().lean();
    res.render('settings/view', {
        title:'Settings',
        wsettings:getSettings,
    });
});

const updateSettings = asyncHandler(async (req, res) => {
    const setting = await Setting.findById({_id:req.body.id})
    setting.head_title = req.body.head_title || setting.head_title
    setting.head_desc = req.body.head_desc || setting.head_desc
    setting.footer_desc = req.body.footer_desc || setting.footer_desc
    setting.facebook_url = req.body.facebook_url ||setting.facebook_url
    setting.insta_url = req.body.insta_url || setting.insta_url
    setting.support_email = req.body.support_email ||setting.support_email
    setting.support_contact = req.body.support_contact ||setting.support_contact
    if (!(isEmptyObject(req.file))) {
        setting.website_logo = req.file.filename
    }
    await setting.save();
    req.flash('success_msg', 'Settings Updated');
    res.redirect('/admin/settings');
});

function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}
export {viewSettings,updateSettings }