import {useEffect, useState} from 'react';

interface useFormProps<T> {
  initialValues: T;
  validate: (values: T) => Record<keyof T, string>;
}

export default function useForm<T>({initialValues, validate}: useFormProps<T>) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChangeText = (name: keyof T, text: string) => {
    setValues(prev => ({...prev, [name]: text}));
  };

  const handleBlur = (name: keyof T) => {
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  };

  const getTextInputProps = (name: keyof T) => {
    const value = values[name];
    const onChangeText = (text: string) => {
      handleChangeText(name, text);
    };
    const onBlur = () => {
      handleBlur(name);
    };

    useEffect(() => {
      const newErrors = validate(values);
      setErrors(newErrors);
    }, [values, validate]);

    return {value, onChangeText, onBlur};
  };

  return {values, errors, touched, getTextInputProps};
}
