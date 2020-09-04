import React, { useState, useEffect, useRef } from 'react'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import logo from './../assets/images/avia-logo.svg'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { withStyles, CircularProgress, Button } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Ticket from './Ticket/Ticket';
import filtersInfo from './filters';
import FiltersFields from './Filters/Filters.jsx';


const theme = createMuiTheme({
   palette: {
      primary: {
         main: '#2196F3'
      },
      secondary: {
         main: '#A0B0B9'
      },
   },
   typography: {
      h4: {
         fontSize: '24px',
         fontWeight: 500
      },
      subtitle1: {
         fontSize: '14px',
         fontWeight: 'bold'
      },
      subtitle2: {
         fontSize: '12px',
         fontWeight: 'bold'
      }
   }
})

const StyledToggleButtonGroup = withStyles(() => ({
   root: {
      display: 'flex'
   }
}))(ToggleButtonGroup);

const StyledToggleButton = withStyles((theme) => ({
   root: {
      padding: '15px 0',
      flexGrow: '1',
      color: theme.palette.text.primary,
      backgroundColor: '#fff',
      '&&:hover': {
         backgroundColor: '#F1FCFF'
      }
   },
   selected: {
      backgroundColor: '#2196F3 !important',
      color: '#fff !important'
   },
}))(ToggleButton);

function TicketsSearch() {

   const pageSize = 5;

   const [allTickets, setAllTickets] = useState([]);
   const [sortedAndFilteredTickets, setSortedAndFilteredTickets] = useState([]);
   const [showTickets, setShowTickets] = useState([]);
   const [loading, setLoading] = useState(false);
   const [loadingMore, setLoadingMore] = useState(false);
   const [ticketPage, setTicketPage] = useState(1);
   const [sortedBy, setSortedBy] = useState('byPrice');
   const [filters, setFilters] = useState(filtersInfo);

   const sortParam = useRef(sortedBy);
   const filtersParams = useRef(filters);

   const onChangeHandlerFilters = (index) => {
      //index or id
      let newState = [...filters];

      if (filters[index].value !== 'all') {
         // first elem anyway 'all' value
         newState[0].checked = false;
         newState[index].checked = !newState[index].checked;
         if (newState.filter(filter => filter.checked).length === 0) {
            newState[0].checked = true; 
         }


      } else {
         newState = newState.map(filter => {
            if (filter.value === 'all') {
               filter.checked = true;
               return filter;
            } else {
               filter.checked = false;
               return filter;
            }
         })
      }

      setFilters(newState);

   }

   const onChangeHandlerSort = (e, sortParam) => {
      if (sortParam) {
         setSortedBy(sortParam);
      }
   }

   const loadTickets = () => {

      setLoadingMore(true);
      // fake request
      setTimeout(() => {

         let newState = [...showTickets, ...sortedAndFilteredTickets.slice(ticketPage * pageSize, ticketPage * pageSize + pageSize)];
         setShowTickets(newState);         
         setLoadingMore(false);
         setTicketPage(ticketPage + 1);

      }, 2000)

   }

   const sortTickets = (tickets, param = 'byPrice') => {

      let sortedTickets;

      if (param === 'byPrice') {

         sortedTickets = [...tickets.sort(({ price: priceA }, { price: priceB }) => priceA - priceB)];

      }

      if (param === 'byDuration') {

         sortedTickets = [...tickets.sort((ticket1, ticket2) => {

            let duration1 = ticket1.segments[0].duration;
            let duration2 = ticket2.segments[0].duration;
            return duration1 - duration2;

         })];

      }

      return sortedTickets;

   }

   // only for stops filter
   const filterTickets = (tickets, filters) => {

      let trueFilters = filters.filter(filter => filter.checked);

      let filteredTickets = tickets.filter(ticket => {

         let matches = false;

         trueFilters.forEach(filter => {

            if (filter.value === 'all') {
               matches = true;
            } else {
               if (ticket.segments[0].stops.length === filter.value) matches = true;
            }

         })

         return matches;

      })

      return filteredTickets;

   }

   useEffect(() => {

      sortParam.current = sortedBy;

      let sortedTickets = sortTickets(sortedAndFilteredTickets, sortedBy);
      setSortedAndFilteredTickets(sortedTickets);
      setShowTickets(sortedTickets.slice(0, pageSize));

   }, [sortedBy])

   useEffect(() => {

      filtersParams.current = filters;

      let filteredTickets = filterTickets(allTickets, filters);
      let sortedAndFilteredTickets = sortTickets(filteredTickets, sortedBy);
      setSortedAndFilteredTickets(sortedAndFilteredTickets);
      setShowTickets(sortedAndFilteredTickets.slice(0, pageSize));

   }, [filters, allTickets, sortedBy])

   useEffect(() => {

      async function initializationRequest() {

         //initialization search
         setLoading(true);

         let response = await fetch('https://front-test.beta.aviasales.ru/search');

         if (response.status === 200) {

            let searchData = await response.json();
            ticketsRequestHelper(searchData.searchId);

         }

      }

      function ticketsRequestHelper(searchId) {

         let newTickets = [];

         (async function ticketsRequest() {
            let response = await fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${searchId}`);

            if (response.status === 200) {

               let ticketsData = await response.json();
               newTickets = [...newTickets, ...ticketsData.tickets];


               if (!ticketsData.stop) {

                  ticketsRequest(searchId);

               } else {

                  setAllTickets(newTickets);
                  let sortedTickets = sortTickets(newTickets, sortParam.current)
                  let filteredAndSortedTickets = filterTickets(sortedTickets, filtersParams.current);
                  setSortedAndFilteredTickets(filteredAndSortedTickets);
                  setShowTickets(filteredAndSortedTickets.slice(0, pageSize));
                  setLoading(false);

               }

            } else {

               //repeat request if server error
               ticketsRequest(searchId);

            }
         })()

      }

      if (!loading && allTickets.length === 0) {
         initializationRequest();
      }

   }, [allTickets, loading])


   return (
      <ThemeProvider theme={theme}>
         <Container maxWidth="md">
            <Grid container justify="center">
               <img src={logo} alt="" />
            </Grid>
            <Grid container spacing={2}>

               {/* Filters */}
               <Grid item xs={3}>
                  <FiltersFields
                     checkboxFilters={filters}
                     onChangeHandlerFilters={onChangeHandlerFilters}
                  />
               </Grid>

               <Grid item xs={7}>

                  {/* Sorted field */}
                  <Grid item xs={12}>
                     <StyledToggleButtonGroup
                        value={sortedBy}
                        exclusive
                        aria-label="sorted field"
                        onChange={onChangeHandlerSort}
                     >
                        <StyledToggleButton value="byPrice">
                           САМЫЙ ДЕШЕВЫЙ
                        </StyledToggleButton>
                        <StyledToggleButton value="byDuration">
                           САМЫЙ БЫСТРЫЙ
                        </StyledToggleButton>
                     </StyledToggleButtonGroup>
                  </Grid>

                  {
                     loading ?
                        <Grid container justify="center" style={{marginTop: '50px'}}>
                           <CircularProgress color="primary" />
                        </Grid>
                        :
                        <>
                           {
                              showTickets.map((ticket, index) => {
                                 return (
                                    <Ticket
                                       key={index}
                                       ticketInfo={ticket}
                                    />
                                 )
                              })
                           }
                           <Grid container justify="center" style={{marginBottom: '20px'}}>
                              <Button
                                 variant="contained"
                                 color="primary"
                                 startIcon={
                                    loadingMore && <CircularProgress style={{ width: '25px', height: '25px' }} color="white" />
                                 }
                                 onClick={loadTickets}
                                 disabled={loadingMore}
                              >
                                 {
                                    loadingMore ?
                                    'Загрузка...' :
                                    'Загрузить ещё' 
                                    
                                 }
                              </Button>
                           </Grid>
                        </>
                  }

               </Grid>
            </Grid>
         </Container>
      </ThemeProvider >
   )
}

export default TicketsSearch
