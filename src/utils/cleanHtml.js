import DOMPurify from 'isomorphic-dompurify';

export const clean = (html) => DOMPurify.sanitize(html);
