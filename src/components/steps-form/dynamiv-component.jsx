import { Stack } from "@mui/material";

export function MultiField({fields, ...other}) {
    return (
      <>
        {fields.map((field, index) => {
          const Component = field.component;
          
          return (
            <Component
              key={index}
              name={field.name}
              label={field.label}
              variant={field.variant}
              InputLabelProps={field.InputLabelProps}
              type={field.type}
              children={field.children}
              options={field.options}
              icon={field.icon}
              disabled={field.disabled}
              columns={field.columns}
              checkbox={field.checkbox}
              chip={field.chip}
              helperText={field.helperText}
              id={field.id}
              defaultValue={field.defaultValue}
              {...other}
            />
          );
        })}
      </>
    );
  }
  
  export function MasterStep({fields, number=1, Provider=Stack, ...other}) {
    return (
      <Provider spacing={3} {...other}>
        <MultiField fields={fields.filter(field => field.step === number)} />
      </Provider>
    )
  }
  