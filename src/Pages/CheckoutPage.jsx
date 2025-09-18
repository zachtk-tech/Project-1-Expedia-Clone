import React, { useState } from 'react'
import {
  Box, Button, HStack, Heading, Icon, Image, Input, SimpleGrid, Text
} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

import { TbBed } from 'react-icons/tb'
import { BsCheck } from 'react-icons/bs'
import { IoIosMan } from 'react-icons/io'
import { AiOutlineWifi } from 'react-icons/ai'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { user } = useSelector((store) => store.LoginReducer)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCompleteBooking = () => {
    if (!user) {
      setError("You must be logged in to book.")
      return
    }

    setLoading(true)

    // Simulate a booking process
    setTimeout(() => {
      setLoading(false)
      navigate("/booking-success") // ✅ redirect to success page
    }, 1500)
  }

  return (
    <Box bg={'gray.300'} width={'100%'} minH={'1000px'} >
      <Box width={'85%'} margin={'auto'} >
        <Heading fontSize={'26px'} fontWeight={'bold'} textAlign={'left'}>
          Review and Book
        </Heading>

        {/* Refund info */}
        <Box bg={'white'} mt={2} p={3} >
          <HStack>
            <Box>
              <Image src='https://i.postimg.cc/mZmMdvzw/Screenshot-2023-04-01-130744.png' alt='image' />
            </Box>
            <Box>
              <Text textAlign={'left'} fontWeight={'bold'}>
                Fully refundable before Sat, 8 Apr, 18:00 (property local time)
              </Text>
              <Text>
                You can change or cancel this stay if plans change. Because flexibility matters.
              </Text>
            </Box>
          </HStack>
        </Box>

        {/* Guest Info + Hotel Details */}
        <SimpleGrid mt={2} gridTemplateColumns={'63% 35%'} gap={"1%"} >
          <Box bg={'white'} p={3}  >
            <Heading textAlign={'left'} fontSize={'20px'} fontWeight={'bold'}>
              Who's Checking
            </Heading>
            <Heading textAlign={'left'} mt={3} fontWeight={'semibold'}>
              Room 1 : 2 Adult 2 twin bed non smoking
            </Heading>
            <Box>
              <Box textAlign={'left'} my={2}>
                <label>
                  First Name : <Input type='text' placeholder='First Name' border='1px solid gray' />
                </label>
              </Box>
              <Box textAlign={'left'} my={2}>
                <label>
                  Surname Name : <Input type='text' placeholder='Surname' border='1px solid gray' />
                </label>
              </Box>
              <Box textAlign={'left'} my={2}>
                <label>
                  Mobile No : <Input type='text' placeholder='Mobile No' border='1px solid gray' />
                </label>
              </Box>
            </Box>

            <Box textAlign={'left'} display={'flex'} >
              <Input type='checkbox'/><Heading ml={2}>Receive text alerts about this trip (free of charge).</Heading>
            </Box>
          </Box>

          <Box bg={'white'} textAlign={'left'} p={2} >
            <Image mb={1} width={'100%'} src='https://images.trvl-media.com/lodging/4000000/3450000/3447500/3447485/4c0514cb_l.jpg' />
            <Heading fontSize={'13px'} >8.8/10 Excellent (820 reviews)</Heading>
            <Heading fontSize={'13px'}>Guests rated this property 9/10 for cleanliness</Heading>
            <Heading fontSize={'13px'}>1 Room: Room, 2 Twin Beds, Non Smoking, City View</Heading>
          
            <SimpleGrid gridTemplateColumns={'repeat(2,1fr)'} mt={3} mb={5} >
              <Box><Icon as={TbBed} fontSize={'18px'} />  2 Twins Bed</Box>
              <Box><Icon as={IoIosMan} fontSize={'18px'} />   Sleeps 3</Box>
              <Box><Icon as={AiOutlineWifi} fontSize={'18px'} />  Free WiFi</Box>
              <Box><Icon as={BsCheck} fontSize={'18px'} />  Free parking</Box>
            </SimpleGrid>
          </Box>
        </SimpleGrid>

        {/* Payment + Price Summary */}
        <SimpleGrid mt={2} gridTemplateColumns={'63% 35%'} gap={"1%"} >
          <Box bg={'white'} p={3}  >
            <Heading textAlign={'left'} fontSize={'20px'} fontWeight={'bold'}>Payment Method</Heading>
            <Heading textAlign={'left'} mt={3} fontWeight={'semibold'}>
              ₹0.00 due now. Payment information is only needed to hold your reservation.
            </Heading>
            
            <Box display={'flex'} gap={'6px'} >
              <Image height={'30px'} width={'30px'} src='https://a.travel-assets.com/dms-svg/payments/cards-cc_american_express.svg' alt='image' />
              <Image height={'30px'} width={'30px'} src='https://a.travel-assets.com/dms-svg/payments/cards-cc_master_card.svg' alt='image' />
              <Image height={'30px'} width={'30px'} src='https://a.travel-assets.com/egds/marks/payment__visa.svg' alt='image' />
              <Image height={'30px'} width={'30px'} src='https://a.travel-assets.com/dms-svg/payments/cards-cc_visa_electron.svg' alt='image' />
            </Box>
          </Box>

          <Box bg={'white'} textAlign={'left'} p={4} >
            <Box justifyContent={'space-between'} display={'flex'}>
              <Box>1 room x 1 night</Box>
              <Box>$9,500.00</Box>
            </Box>

            <Box justifyContent={'space-between'} display={'flex'}>
              <Box>Taxes</Box>
              <Box>$1,710.00</Box>
            </Box>

            <Box justifyContent={'space-between'} display={'flex'} fontWeight={'bold'}>
              <Box>Total</Box>
              <Box>$11,210.00</Box>
            </Box>

            <Box justifyContent={'space-between'} display={'flex'} color='green.600'>
              <Box>Pay Now</Box>
              <Box>$0.00</Box>
            </Box>

            <Box justifyContent={'space-between'} display={'flex'}>
              <Box>Pay at property</Box>
              <Box>$11,210.00</Box>
            </Box>

            {error && <Text color="red.500">{error}</Text>}

            <Button
              mt={4}
              width={'100%'}
              height='40px'
              bg={'#FF9800'}
              rounded={'7px'}
              onClick={handleCompleteBooking}
              isLoading={loading}
            >
              Complete Booking
            </Button>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  )
}

export default CheckoutPage
