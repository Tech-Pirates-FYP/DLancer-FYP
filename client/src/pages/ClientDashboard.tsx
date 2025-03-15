import { useSelector } from "react-redux";
import { RootState } from "../features/store";
import { useAcceptProposalMutation, useGetGigsByWalletQuery } from "../features/gig/gigAPI";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";


export default function ClientDashboard() {

  const walletAddress = useSelector((state: RootState) => state.auth.walletAddress);
  console.log("walletAddress: ", walletAddress);

  const { data: gigs, error, isLoading } = useGetGigsByWalletQuery(walletAddress!, {
    skip: !walletAddress,
  });

  const [ acceptProposal, { isSuccess } ] = useAcceptProposalMutation();

  // console.log("gigs: ", gigs);

  const onAcceptClick = async (gigId: string, proposalId: string) => {
    try {
      await acceptProposal({ gigId, proposalId }).unwrap();
      toast.success("Successfully Accepted the proposal", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(`Accepted proposal ${proposalId} for gig ${gigId}`);
    } catch (error) {
      console.error("Error accepting proposal:", error);
    }
  };

  if (isLoading) return <p>Loading gigs...</p>;
  if (error) return <p>Error fetching gigs</p>;


  return (
    <Card className="p-6">
      <ToastContainer aria-label={undefined} />

      <h2 className="text-2xl font-bold mb-6">Client Dashboard</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price ($)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Freelancer Assigned</TableHead>
            <TableHead>View File</TableHead>
            <TableHead>Proposals</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {
            gigs?.map((gig) => (
            <TableRow key={(gig as any)._id}>
              <TableCell>{gig.title}</TableCell>
              <TableCell>{gig.category}</TableCell>
              <TableCell>{gig.price}</TableCell>
              <TableCell>
              <Badge variant={gig.status === "completed" ? "default" : gig.status === "pending" ? "secondary" : "destructive"}>
                {gig.status}
              </Badge>
              </TableCell>
              <TableCell>
                <span>
                  {gig.freelancerAddress &&
                    `${gig.freelancerAddress.slice(0, 6)}...${gig.freelancerAddress.slice(-4)}`
                  }
                </span>
              </TableCell>

              <TableCell>
                {gig.proposals?.map((prop, index) => (
                  <div key={index} className="flex items-center justify-between mb-2">
                    <span>
                      {`${prop.file}`}
                    </span>
                  </div>
                ))}
              </TableCell>
              <TableCell>
                {gig.proposals?.map((prop, index) => (
                  <div key={index} className="flex items-center justify-between mb-2">
                    <span>
                      {`${prop.freelancerAddress.slice(0, 6)}...${prop.freelancerAddress.slice(-4)}`}
                    </span>
                    {prop.status !== "accepted" && (
                      <Button className="ml-2" onClick={() => onAcceptClick(gig._id, prop._id)}>
                        Accept
                      </Button>
                    )}
                  </div>
                ))}
              </TableCell>
              
            </TableRow>
            ))
          }
        </TableBody>
        
      </Table>
    </Card>
  );
}
