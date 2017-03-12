package cz.kartrace.kartchamp.web.management;

import cz.kartrace.kartchamp.domain.Season;
import cz.kartrace.kartchamp.service.SeasonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * @author hradecky
 */
@Controller
public class SeasonController {

    private SeasonService seasonService;

    @Autowired
    public SeasonController(SeasonService seasonService) {
        this.seasonService = seasonService;
    }

    @RequestMapping("/management/season")
    public String index(Model model) {
        model.addAttribute("seasons", seasonService.getSeasons());
        return "management/season";
    }

    @RequestMapping("/management/season/add")
    public String add(Model model) {
        model.addAttribute("season", new Season("", 0));
        return "management/season_edit";
    }

    @RequestMapping("/management/season/edit")
    public String edit(@RequestParam(value="season_id") String seasonId, Model model) {
        model.addAttribute("season", seasonService.getSeasonById(seasonId));
        return "management/season_edit";
    }

}
