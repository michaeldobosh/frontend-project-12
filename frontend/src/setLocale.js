import { setLocale } from 'yup';

export default () => setLocale({
  mixed: {
    default: 'dafault',
    required: 'is_a_required_field',
    oneOf: 'password_mismatch',
    notOneOf: 'must_be_unique',
  },
  string: {
    min: 'min_${min}',
    max: 'max_${max}',
  },
});
