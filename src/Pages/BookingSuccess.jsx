import React from "react"
import { Box, Button, Heading, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

const BookingSuccess = () => {
  return (
    <Box textAlign="center" mt={20}>
      <Heading mb={4}>Booking Confirmed!</Heading>
      <Text mb={6}>Your reservation has been saved successfully.</Text>
      <Button as={Link} to="/" colorScheme="orange">
        Back to Home
      </Button>
    </Box>
  )
}

export default BookingSuccess
