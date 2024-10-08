import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string | null;
  options: SelectOption[];
  onChange: (value: string) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <FormControl sx={{ m: 1, width: '300px' }}>
      <InputLabel id={`${label.toLowerCase()}-select-label`}>
        {label}
      </InputLabel>
      <Select
        labelId={`${label.toLowerCase()}-select-label`}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        label={`Select ${label}`}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export default SelectField;
