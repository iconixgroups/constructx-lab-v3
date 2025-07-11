import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MoreHorizontal, Edit, Trash2, Eye, Mail, Phone } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  department: string;
  isActive: boolean;
  startDate: string;
  skills: string[];
  certifications: string[];
  teams: string[];
  availability: string;
  hourlyRate: number;
  phone: string;
  avatar: string | null;
}

interface TeamMembersGridProps {
  teamMembers: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
}

const TeamMembersGrid: React.FC<TeamMembersGridProps> = ({ teamMembers, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {teamMembers.length === 0 ? (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No team members found.
        </div>
      ) : (
        teamMembers.map((member) => (
          <Card key={member.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-sm">{member.title}</CardDescription>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => { /* Implement view details */ }}>
                    <Eye className="mr-2 h-4 w-4" />View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(member)}>
                    <Edit className="mr-2 h-4 w-4" />Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(member)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-sm text-muted-foreground mb-2">{member.role} - {member.department}</div>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Mail className="h-4 w-4 mr-2" />{member.email}
              </div>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Phone className="h-4 w-4 mr-2" />{member.phone}
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {member.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {member.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="border-blue-500 text-blue-500">{cert}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-0">
              <Badge variant={member.isActive ? "default" : "outline"}>
                {member.isActive ? "Active" : "Inactive"}
              </Badge>
              <div className="text-sm text-muted-foreground">{member.teams.join(', ')}</div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default TeamMembersGrid;


