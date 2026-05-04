import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Flex } from "@chakra-ui/react";
import { TransactionDetail } from "../components/TransactionDetail";
import { LucideChevronLeft } from "lucide-react";

const TransactionDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  return (
    <Container maxW="3xl" py={10}>
      <Flex mb={6}>
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          gap={2}
          color="earth.600"
          _hover={{ bg: "sand.100" }}
        >
          <LucideChevronLeft size={18} /> Volver
        </Button>
      </Flex>

      <TransactionDetail transactionId={id} />
    </Container>
  );
};

export { TransactionDetailPage };