// Client-side fallback generator for SK drafts
// Ensures that if the server/API fails or returns 500, the user still gets a complete, professional draft SK instantly!

import { cleanSKJudul } from "./skFormatter";
import { Employee } from "../types";

export interface LocalSKDraftResult {
  judul: string;
  menimbang: string[];
  mengingat: string[];
  memperhatikan: string;
  diktum: Array<{ poin: string; isi: string }>;
  tembusan: string[];
  lampiranList: Array<{
    id?: string;
    nomorLampiran: string;
    judul: string;
    jenisLampiran?: string;
    headers: string[];
    rows: string[][];
    footerNote?: string;
  }>;
  aiNotes?: string[];
}

export function generateClientSideSKDraft(
  judul: string,
  tahunAjaran: string,
  sekolah: any,
  employees: Employee[] = [],
  dataKhusus?: any
): LocalSKDraftResult {
  const cleanTitle = cleanSKJudul(judul, tahunAjaran) || "PEMBAGIAN TUGAS GURU DAN TENAGA KEPENDIDIKAN";
  const namaSekolah = sekolah?.nama || "SD Negeri 3 Loloan Timur";
  const namaKab = sekolah?.kabupaten || "Jembrana";
  const namaKec = sekolah?.kecamatan || "Negara";
  const tanggalRapat = dataKhusus?.tanggalRapat || "18 Juni 2025";
  const low = cleanTitle.toLowerCase();

  // Dasar hukum standar
  const dasarHukumStandard = [
    "Undang-undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;",
    "Peraturan Pemerintah Nomor 4 Tahun 2022 tentang Perubahan atas Peraturan Pemerintah Nomor 57 Tahun 2021 tentang Standar Nasional Pendidikan;",
    "Peraturan Menteri Pendidikan Dasar dan Menengah RI Nomor 12 Tahun 2025 tentang Standar Isi pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah;",
    "Peraturan Menteri Pendidikan Dasar dan Menengah RI Nomor 13 Tahun 2025 tentang Kurikulum pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah;",
    "Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 47 Tahun 2023 tentang Standar Pengelolaan;",
    `Keputusan Kepala Dinas Pendidikan Kepemudaan dan Olahraga Kabupaten ${namaKab} tentang Kalender Pendidikan bagi Satuan Pendidikan Tahun Ajaran ${tahunAjaran};`,
  ];

  // Susunan baris guru
  const guruRows: string[][] = employees.slice(0, 10).map((emp, idx) => {
    const nipFormatted = emp.nip && emp.nip !== "-" 
      ? (emp.statusKepegawaian === "PPPK" ? `NIPPPK. ${emp.nip}` : `NIP. ${emp.nip}`) 
      : "-";
    const pangkatGol = emp.pangkat && emp.golongan ? `${emp.pangkat}\n/${emp.golongan}` : "-";
    const peran = idx === 0 ? "Ketua / Koordinator" : idx === 1 ? "Sekretaris" : idx === 2 ? "Bendahara" : "Anggota Pelaksana";

    return [
      String(idx + 1),
      `${emp.nama}\n${nipFormatted}`,
      pangkatGol,
      emp.jabatan || "Guru Kelas",
      peran,
      `Melaksanakan tugas operasional ${cleanTitle} secara bertanggung jawab`,
      "-",
    ];
  });

  return {
    judul: cleanTitle,
    menimbang: [
      `Bahwa dalam rangka mendukung kelancaran pelaksanaan program dan peningkatan mutu layanan pendidikan di ${namaSekolah}, dipandang perlu menetapkan ${cleanTitle} melalui Surat Keputusan Kepala Sekolah.`,
      `Bahwa mereka yang namanya tercantum dalam lampiran keputusan ini dianggap cakap, mampu, dan memenuhi syarat untuk melaksanakan tugas yang diamanahkan.`,
      `Bahwa berdasarkan pertimbangan sebagaimana dimaksud pada huruf a dan b, perlu menetapkan Keputusan Kepala Sekolah tentang ${cleanTitle}.`,
    ],
    mengingat: dasarHukumStandard,
    memperhatikan: `Hasil Keputusan Rapat Dewan Guru ${namaSekolah} pada tanggal ${tanggalRapat} tentang ${cleanTitle}.`,
    diktum: [
      {
        poin: "KESATU",
        isi: `Membentuk dan menetapkan susunan pelaksana ${cleanTitle} pada ${namaSekolah} Tahun Ajaran ${tahunAjaran} sebagaimana tercantum dalam lampiran yang merupakan bagian tidak terpisahkan dari keputusan ini.`,
      },
      {
        poin: "KEDUA",
        isi: "Masing-masing personil yang ditunjuk wajib melaksanakan tugas dengan penuh tanggung jawab serta melaporkan hasil pelaksanaannya secara berkala kepada Kepala Sekolah.",
      },
      {
        poin: "KETIGA",
        isi: "Segala biaya yang timbul akibat pelaksanaan keputusan ini dibebankan pada anggaran sekolah yang sah dan relevan.",
      },
      {
        poin: "KEEMPAT",
        isi: "Keputusan ini mulai berlaku sejak tanggal ditetapkan, dan apabila terdapat kekeliruan di kemudian hari akan diadakan perbaikan sebagaimana mestinya.",
      },
    ],
    tembusan: [
      `Kepala Dinas Pendidikan Kepemudaan dan Olahraga Kabupaten ${namaKab}`,
      `Korwil Satuan Pendidikan Formal (SPF) Kecamatan ${namaKec}`,
      "Pengawas Sekolah Pembina",
      "Ketua Komite Sekolah",
      "Arsip Sekolah",
    ],
    lampiranList: [
      {
        nomorLampiran: "Lampiran I",
        judul: `SUSUNAN PELAKSANA ${cleanTitle}`,
        jenisLampiran: "susunan_tim",
        headers: ["No", "Nama / NIP", "Pangkat / Gol", "Jabatan", "Jabatan Tim", "Uraian Tugas", "Ket."],
        rows: guruRows.length > 0 ? guruRows : [
          ["1", `${sekolah?.kepalaSekolah?.nama || "Susilo Fitri Yatmoko, M.Pd"}\nNIP. ${sekolah?.kepalaSekolah?.nip || "19880521 201101 1 010"}`, "Pembina / IV/a", "Kepala Sekolah", "Penanggung Jawab", "Mengawasi & mengarahkan pelaksanaan kegiatan", "-"],
        ],
        footerNote: "Semua pelaksana bertanggung jawab langsung kepada Kepala Sekolah.",
      },
    ],
    aiNotes: [
      "Draf disusun dengan standar tata naskah dinas resmi Permendikdasmen dan siap diekspor ke Microsoft Word (.docx).",
    ],
  };
}
