import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import { DbFamilyMember, MemberFormData } from "@/hooks/useFamilyMembers";

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: DbFamilyMember | null;
  onSubmit: (data: MemberFormData) => Promise<void>;
  onUploadPhotos?: (files: File[]) => Promise<void>;
  isSubmitting?: boolean;
}

const generationLabels: Record<number, string> = {
  0: "Great-Grandparents",
  1: "Grandparents",
  2: "Parents & Aunts/Uncles",
  3: "Subject & Siblings",
  4: "Children & Nieces/Nephews",
};

const emptyForm: MemberFormData = {
  name: "",
  date_of_birth: "",
  birth_place: "",
  date_of_death: "",
  death_place: "",
  relationship: "",
  gender: "male",
  bio: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
  generation: 3,
};

export const MemberFormDialog = ({
  open, onOpenChange, member, onSubmit, onUploadPhotos, isSubmitting,
}: MemberFormDialogProps) => {
  const [form, setForm] = useState<MemberFormData>(emptyForm);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name,
        date_of_birth: member.date_of_birth || "",
        birth_place: member.birth_place || "",
        date_of_death: member.date_of_death || "",
        death_place: member.death_place || "",
        relationship: member.relationship,
        gender: member.gender,
        bio: member.bio || "",
        email: member.email || "",
        phone: member.phone || "",
        address: member.address || "",
        notes: member.notes || "",
        generation: member.generation,
      });
    } else {
      setForm(emptyForm);
    }
    setSelectedFiles([]);
  }, [member, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    if (selectedFiles.length > 0 && onUploadPhotos) {
      await onUploadPhotos(selectedFiles);
    }
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const set = (key: keyof MemberFormData, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {member ? "Edit Family Member" : "Add Family Member"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" required value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={form.gender} onValueChange={v => set("gender", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship *</Label>
              <Input id="relationship" required value={form.relationship} onChange={e => set("relationship", e.target.value)} placeholder="e.g. Father, Sister, Son" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="generation">Generation</Label>
              <Select value={String(form.generation)} onValueChange={v => set("generation", Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(generationLabels).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates & Places */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" value={form.date_of_birth} onChange={e => set("date_of_birth", e.target.value)} placeholder="e.g. 14 February 1972" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthplace">Birth Place</Label>
              <Input id="birthplace" value={form.birth_place} onChange={e => set("birth_place", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dod">Date of Death</Label>
              <Input id="dod" value={form.date_of_death} onChange={e => set("date_of_death", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deathplace">Death Place</Label>
              <Input id="deathplace" value={form.death_place} onChange={e => set("death_place", e.target.value)} />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={form.address} onChange={e => set("address", e.target.value)} />
            </div>
          </div>

          {/* Bio & Notes */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio / Description</Label>
            <Textarea id="bio" value={form.bio} onChange={e => set("bio", e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} />
          </div>

          {/* Photo Upload */}
          {!member && (
            <div className="space-y-2">
              <Label>Photos</Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-2">
                  <Upload className="w-4 h-4" /> Add Photos
                </Button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
              </div>
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-1 px-2 py-1 rounded bg-secondary text-sm">
                      {file.name}
                      <button type="button" onClick={() => removeFile(i)}><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {member ? "Save Changes" : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
