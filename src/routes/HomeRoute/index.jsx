import { Stack, Heading, FormControl, FormLabel, Button, Input } from '@chakra-ui/react'

export const HomeRoute = () => {
    return (
        <Stack as="form"
            method="GET"
            action="/publisher"
            transform="translate(50%,50%)"
            p={8}
            gap={2}
            maxW={500}
            boxShadow="xl"
            borderRadius={10}
        >
            <Heading fontSize='3xl'>React Millicast</Heading>
            <FormControl required>
                <FormLabel>Stream Name</FormLabel>
                <Input required placeholder="Stream Name" name="streamName" />
            </FormControl>
            <FormControl required>
                <FormLabel>Publishing Token</FormLabel>
                <Input required placeholder="Publishing Token" name="publishingToken" />
            </FormControl>
            <Button type="submit">Start Streaming</Button>
        </Stack>
    )
}
