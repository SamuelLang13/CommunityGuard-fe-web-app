// src/components/CommunityGuard.jsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Camera, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function CommunityGuard() {
  const [issue, setIssue] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleReport = () => {
    console.log({ issue, location, photo });
    alert("Ďakujeme za nahlásenie problému. Spolu to dáme do poriadku! 💪");
    setIssue("");
    setLocation("");
    setPhoto(null);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto grid gap-4">
      <motion.h1
        className="text-3xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        CommunityGuard
      </motion.h1>
      <motion.p
        className="text-center text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Nahláste problém vo vašom okolí a pomôžte svojej komunite.
      </motion.p>

      <Card className="rounded-2xl shadow-md">
        <CardContent className="grid gap-4 p-4">
          <Textarea
            placeholder="Popíšte problém..."
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          />
          <Input
            placeholder="Lokalita alebo adresa"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <Camera className="w-5 h-5" />
            <span>Priložte fotku (voliteľné)</span>
            <Input
              type="file"
              className="hidden"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </label>
          <Button onClick={handleReport} className="flex gap-2">
            <Send className="w-4 h-4" /> Nahlásiť
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
