import fs from 'fs';
import { FluentBundle } from 'fluent';
import log from '../utils/log';

export type i18nOptions = {
    [key:string]: string
};

const langs : {
    [key:string]: FluentBundle
} = {};

{
  const supportedLangs = process.env.SUPPORTED_LANG.split(' ');
  const langDir = process.env.LANG_DIR;
  const globalConf = fs
    .readFileSync(`${langDir}/global.ftl`, 'utf8')
    .toString();

  supportedLangs.forEach((lang) => {
    const b = new FluentBundle(lang, { useIsolating: false });
    b.addMessages(globalConf);
    const errors = b.addMessages(
      fs.readFileSync(`${langDir}/${lang}.ftl`, 'utf8').toString(),
    );
    if (errors.length) {
      log(`Errors parsing language: ${lang}`);
      log(errors);
      return;
    }
    langs[lang] = b;
  });
}

const i18n = (lang: string, key: string, options?: i18nOptions) : string => {
  const bundle = langs[lang];
  if (!bundle) {
    if (lang !== 'en') return i18n('en', key, options);
    return `{{${lang}}}`;
  }
  const msg = bundle.getMessage(key);
  if (!msg) {
    if (lang !== 'en') return i18n('en', key, options);
    log(`i18n - Could not resolve key: ${key}`);
    return `{{${key}}}`;
  }
  const errors : (string | Error)[] = [];
  const res = bundle.format(msg, options, errors);
  if (errors.length) {
    log(`i18n - Errors with ${key}`);
    log(options);
    log(errors);
  }
  return res;
};

export default i18n;
