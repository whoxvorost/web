import React, {FC} from 'react';

interface FormInputProps {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    isTextArea?: boolean;
}

const FormInput: FC<FormInputProps> = ({label, value, onChange, type = "text", isTextArea = false}) => {
    return (
        <div>
            <label>{label}:</label>
            {isTextArea ? (
                <textarea value={value} onChange={onChange} />
            ) : (
                <input type={type} value={value} onChange={onChange} />
            )}
        </div>
    );
};

export default FormInput;