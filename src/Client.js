import { REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY } from './constants';

import {
    createClient
  } from '@supabase/supabase-js'

  export const clientA = createClient(
    REACT_APP_SUPABASE_URL,
    REACT_APP_SUPABASE_KEY
  )


  export const clientB = createClient(
    REACT_APP_SUPABASE_URL,
    REACT_APP_SUPABASE_KEY
  )
