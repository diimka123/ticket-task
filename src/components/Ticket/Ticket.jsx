import React from 'react'
import { Grid, Paper, withStyles, Typography } from '@material-ui/core'

const StyledPaper = withStyles((theme) => ({
   root: {
      margin: theme.spacing(2, 0),
      padding: '20px'
   }
}))(Paper)

function Ticket({ ticketInfo }) {
   return (
      <Grid item xs={12}>
         <StyledPaper elevation={3}>
            <Grid container>
               <Grid style={{ display: 'flex', alignItems: 'center' }} item xs={4}>
                  <Typography color="primary" variant="h4">
                     {ticketInfo.price} Р
                  </Typography>
               </Grid>
               <Grid item xs={4}></Grid>
               <Grid style={{ display: 'flex' }} item xs={4}>
                  <img style={{ width: 'auto', height: '36px' }} alt="" src={`http://pics.avs.io/99/36/${ticketInfo.carrier}.png`} />
               </Grid>
            </Grid>
            <Grid style={{ marginTop: '20px' }} container>
               <Grid item xs={4}>
                  <Grid item style={{ marginBottom: '10px' }}>
                     <Typography color="secondary" variant="subtitle2">
                        {ticketInfo.segments[0].origin} - {ticketInfo.segments[0].destination}
                     </Typography>
                     <Typography variant="subtitle1">
                        {dateFormatter(ticketInfo.segments[0].date)} - {timeCalculator(ticketInfo.segments[0].date, ticketInfo.segments[0].duration)}
                     </Typography>
                  </Grid>
                  <Grid item>
                     <Typography color="secondary" variant="subtitle2">
                        {ticketInfo.segments[1].origin} - {ticketInfo.segments[1].destination}
                     </Typography>
                     <Typography variant="subtitle1">
                        {dateFormatter(ticketInfo.segments[1].date)} - {timeCalculator(ticketInfo.segments[1].date, ticketInfo.segments[0].duration)}
                     </Typography>
                  </Grid>
               </Grid>
               <Grid item xs={4}>
                  <Grid item style={{ marginBottom: '10px' }}>
                     <Typography color="secondary" variant="subtitle2">
                        В ПУТИ
                     </Typography>
                     <Typography variant="subtitle1">
                        {Math.floor(ticketInfo.segments[0].duration / 60)}ч {ticketInfo.segments[0].duration % 60}м
                     </Typography>
                  </Grid>
                  <Grid item>
                     <Typography color="secondary" variant="subtitle2">
                        В ПУТИ
                     </Typography>
                     <Typography variant="subtitle1">
                        {Math.floor(ticketInfo.segments[1].duration / 60)}ч {ticketInfo.segments[1].duration % 60}м
                     </Typography>
                  </Grid>
               </Grid>
               <Grid item xs={4}>
                  <Grid item style={{ marginBottom: '10px' }}>
                     <Typography color="secondary" variant="subtitle2">
                        ПЕРЕСАДКИ:
                     </Typography>
                     <Typography variant="subtitle1">
                        {
                           ticketInfo.segments[0].stops.length === 0
                              ? 'Без пересадок'
                              : ticketInfo.segments[0].stops.map((stop, i, arr) => {
                                 if (arr.length - 1 !== i) {
                                    return stop + ', '
                                 } else {
                                    return stop
                                 }
                              })
                        }
                     </Typography>
                  </Grid>
                  <Grid item>
                     <Typography color="secondary" variant="subtitle2">
                        ПЕРЕСАДКИ:
                     </Typography>
                     <Typography variant="subtitle1">
                        {
                           ticketInfo.segments[1].stops.length === 0
                              ? 'Без пересадок'
                              : ticketInfo.segments[1].stops.map((stop, i, arr) => {
                                 if (arr.length - 1 !== i) {
                                    return stop + ', '
                                 } else {
                                    return stop
                                 }
                              })
                        }
                     </Typography>
                  </Grid>
               </Grid>
            </Grid>
         </StyledPaper>
      </Grid>
   )
}

function timeCalculator(dateCode, duration) {

   let arrivedStamp = Number(new Date(dateCode)) + duration * 60 * 1000;
   let arrivedTime = new Date(arrivedStamp);
   return dateFormatter(arrivedTime);

}

function dateFormatter(dateCode) {

   return (new Date(dateCode)).toLocaleString('ru', {
      hour: '2-digit',
      minute: '2-digit'
   })

}

export default Ticket
