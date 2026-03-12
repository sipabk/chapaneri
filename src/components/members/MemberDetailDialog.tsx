import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Calendar, MapPin, Mail, Phone, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { DbFamilyMember, MemberPhoto } from "@/hooks/useFamilyMembers";

interface MemberDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: DbFamilyMember | null;
  photos: MemberPhoto[];
}

export const MemberDetailDialog = ({ open, onOpenChange, member, photos }: MemberDetailDialogProps) => {
  if (!member) return null;

  const primaryPhoto = photos.find(p => p.is_primary) || photos[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{member.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar */}
          <div className={cn(
            "w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-card overflow-hidden",
            !primaryPhoto && (member.gender === "male"
              ? "bg-gradient-to-br from-primary to-primary/80"
              : "bg-gradient-to-br from-accent to-accent/80")
          )}>
            {primaryPhoto ? (
              <img src={primaryPhoto.photo_url} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <User className={cn("w-12 h-12", member.gender === "male" ? "text-primary-foreground" : "text-accent-foreground")} />
            )}
          </div>

          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
              {member.relationship}
            </span>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            {member.date_of_birth && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Born: {member.date_of_birth}</span>
              </div>
            )}
            {member.birth_place && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{member.birth_place}</span>
              </div>
            )}
            {member.date_of_death && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Died: {member.date_of_death}</span>
              </div>
            )}
            {member.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href={`mailto:${member.email}`} className="text-sm hover:text-primary">{member.email}</a>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{member.phone}</span>
              </div>
            )}
            {member.address && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <Home className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{member.address}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {member.bio && (
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">About</h3>
              <p className="text-sm text-muted-foreground">{member.bio}</p>
            </div>
          )}

          {/* Photos Gallery */}
          {photos.length > 1 && (
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {photos.map(photo => (
                  <img key={photo.id} src={photo.photo_url} alt={photo.caption || member.name}
                    className="w-full aspect-square object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
