import { User, Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { DbFamilyMember } from "@/hooks/useFamilyMembers";

interface DbMemberCardProps {
  member: DbFamilyMember;
  photoUrl?: string | null;
  canEdit: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export const DbMemberCard = ({ member, photoUrl, canEdit, onEdit, onDelete, onClick }: DbMemberCardProps) => {
  return (
    <div className="group heritage-card hover:shadow-heritage transition-all duration-300 hover:-translate-y-1 cursor-pointer relative" onClick={onClick}>
      {/* Edit/Delete Buttons */}
      {canEdit && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={e => e.stopPropagation()}>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onEdit}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {member.name}?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Avatar / Photo */}
      <div className={cn(
        "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-card transition-transform duration-300 group-hover:scale-110 overflow-hidden",
        !photoUrl && (member.gender === "male"
          ? "bg-gradient-to-br from-primary to-primary/80"
          : "bg-gradient-to-br from-accent to-accent/80")
      )}>
        {photoUrl ? (
          <img src={photoUrl} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <User className={cn("w-8 h-8", member.gender === "male" ? "text-primary-foreground" : "text-accent-foreground")} />
        )}
      </div>

      {/* Info */}
      <div className="text-center space-y-2">
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {member.name}
        </h3>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
          {member.relationship}
        </span>
        <div className="space-y-1 pt-2">
          {member.date_of_birth && (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{member.date_of_birth}</span>
            </p>
          )}
          {member.birth_place && (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{member.birth_place.split(",")[0]}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
