import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';


const useStylesCheckbox = makeStyles({
   root: {
      padding: '10px',
      '&&:hover': {
         backgroundColor: 'transparent'
      }
   }
});

const useStylesWrapper = makeStyles({
   root: {
      width: '100%',
      margin: 0,
      paddingLeft: '10px',
      transition: 'all 0.3s',
      '&&:hover': {
         backgroundColor: '#F1FCFF'
      },
      '&:last-child': {
         borderRadius: '0 0 5px 5px'
      }
   }
});



function Filters({checkboxFilters, onChangeHandlerFilters}) {

   const checkboxClasses = useStylesCheckbox();
   const wrapperClasses = useStylesWrapper()

   return (
      <Paper elevation={3}>
         <Typography variant="subtitle2" style={{ padding: '20px 0 0 20px' }}>
            КОЛИЧЕСТВО ПЕРЕСАДОК
         </Typography>
         <FormGroup row>
            {
               checkboxFilters.map((filter, index) => {
                  return (
                     <FormControlLabel
                        className={wrapperClasses.root}
                        key={index}
                        control={
                           <Checkbox
                              className={checkboxClasses.root}
                              checked={filter.checked}
                              onChange={() => onChangeHandlerFilters(index)}
                              color="primary"
                           />
                        }
                        label={filter.title}
                     />
                  )
               })
            }
         </FormGroup>
      </Paper>
   )
}

export default Filters
